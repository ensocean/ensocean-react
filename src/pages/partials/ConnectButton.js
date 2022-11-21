 
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
 
import { obscureAddress } from '../../helpers/String';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';


window.Buffer = require("buffer").Buffer;
 
function ConnectButton() { 
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
   
    if(SUPPORTED_CHAIN_ID !== chain?.id) {
      return (
        <>
        <span className='text-dark me-2'>{obscureAddress(address)}</span>
        <button className='btn btn-danger' disabled={!switchNetwork || SUPPORTED_CHAIN_ID === chain?.id} key={SUPPORTED_CHAIN_ID} onClick={handleSwitchChain} >
          {'Wrong Network'} {isLoading && pendingChainId === SUPPORTED_CHAIN_ID && ' (switching)'}
        </button>
        </> 
      )
    } else if(SUPPORTED_CHAIN_ID === chain?.id && ensName) {
        return (
          <span className='text-dark me-2'>{ensName} 
          <CopyToClipboard text={address}  onCopy={() => toast.success("Your address has been copied to clipboard") }>
            <span className='cursor-pointer'>({obscureAddress(address)})</span>
          </CopyToClipboard>
          </span>
        )
    } else if (SUPPORTED_CHAIN_ID === chain?.id && !ensName) {
        return (
          <>
          <span className='text-dark me-2'>
          <CopyToClipboard text={address}  onCopy={() => toast.success("Your address has been copied to clipboard") }>
            <span className='cursor-pointer'>{obscureAddress(address)}</span>
          </CopyToClipboard>
          </span>
          <button className='btn btn-primary' onClick={handleDisconnect}>Disconnect</button>
          </>
        )
    } 

  } else { 
    return (
      <> 
        <button className='btn btn-primary' onClick={handleConnect}>Connect Wallet</button>
      </>
    )
  } 
}

export default ConnectButton;