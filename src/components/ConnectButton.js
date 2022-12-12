 
import '@rainbow-me/rainbowkit/styles.css';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { 
  useDisconnect,
  useConnect, 
  useAccount,   
  useEnsAvatar,
  useEnsName,
  useNetwork,
  useSwitchNetwork
} from 'wagmi';
 
import { obscureAddress, obscureLabel, obscureName } from '../helpers/String';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { Exclamation, ExclamationCircle } from 'react-bootstrap-icons';


window.Buffer = require("buffer").Buffer;
 
function ConnectButton({smallButton = false}) { 
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { openConnectModal } = useConnectModal(); 
  const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);

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
    if(error) { 
      toast.error(error.message)
    }
  }
  
  if (isConnected) {
    return ( 
      <> 
        { SUPPORTED_CHAIN_ID !== chain?.id ? 
          <OverlayTrigger placement="top"  overlay={<Tooltip>Wrong Network! Click to Change Network</Tooltip>} >
            <button className={"btn btn-danger " + (smallButton ? "btn-sm": "") } disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
              {isLoading && pendingChainId === SUPPORTED_CHAIN_ID && <Spinner animation="border" variant="white" size="sm" />}
              {smallButton ? <ExclamationCircle /> : <span> Wrong Network</span> } 
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