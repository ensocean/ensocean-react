 
import '@rainbow-me/rainbowkit/styles.css';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { 
  useDisconnect, 
  useAccount,    
  useNetwork,
  useSwitchNetwork
} from 'wagmi';
  
import { toast } from 'react-toastify'; 
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { ExclamationCircle } from 'react-bootstrap-icons';
import { useEffect } from 'react';


window.Buffer = require("buffer").Buffer;
 
function ConnectButton({smallButton = false}) { 
  const { isConnected } = useAccount() 
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork()
  const { data, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { openConnectModal } = useConnectModal(); 
  const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);

  console.log(chain)
  const handleConnect = (e) => {
    e.preventDefault();
    openConnectModal();
  }
  
  const handleDisconnect = (e) => {
    e.preventDefault();
    disconnect();
  }

  const handleSwitchChain = (e) => {
    e.preventDefault();
    switchNetwork?.(SUPPORTED_CHAIN_ID);
  }

  useEffect(()=> { 
    if(error) { 
      toast.error(error.message)
    }
  }, [error]);
  
  if (isConnected) {
    return ( 
      <> 
        { SUPPORTED_CHAIN_ID !== chain?.id ? 
          <OverlayTrigger placement="top"  overlay={<Tooltip>Wrong Network! Click to Change Network</Tooltip>} >
            <button className={"btn btn-danger " + (smallButton ? "btn-sm": "") } disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
              {smallButton &&
                <>
                  {isLoading && pendingChainId === SUPPORTED_CHAIN_ID &&
                    <Spinner animation="border" variant="white" size="sm" />
                  } 

                  {!isLoading && 
                    <ExclamationCircle />
                  }
                </>
              }

              {!smallButton &&
                <>
                  {isLoading && pendingChainId === SUPPORTED_CHAIN_ID && 
                    <Spinner animation="border" variant="white" size="sm" />
                  }
                  {!isLoading &&
                    <span> Wrong Network</span>
                  }
                </>
              } 
            </button> 
          </OverlayTrigger>
        : <button className={"btn btn-primary " + (smallButton ? "btn-sm": "") } onClick={handleDisconnect}>Disconnect</button>}
      </> 
    ) 

  } else { 
    return (
      <> 
        <button className={"btn btn-primary " + (smallButton ? "btn-sm": "") } onClick={handleConnect}>
          {smallButton ? <span>Connect</span>: <span>Connect Wallet</span>}
          </button>
      </>
    )
  } 
}

export default ConnectButton;