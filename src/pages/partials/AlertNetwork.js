import { useAccount, useNetwork } from 'wagmi';
   
function AlertNetwork() { 
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  
  const SUPPORTED_CHAIN_ID = Number(process.env.REACT_APP_SUPPORTED_CHAIN_ID);
 
  if (isConnected && SUPPORTED_CHAIN_ID !== chain?.id) {
    return (
        <div className='alert alert-danger rounded-0 fs-bold p-1 text-center'>Wrong network! Please switch to Ethereum mainnet.</div>
    )
  } else { 
    return (<></>)
  } 
}

export default AlertNetwork;