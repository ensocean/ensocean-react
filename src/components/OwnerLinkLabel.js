import { Link } from 'react-router-dom';
import { useAccount, useEnsName } from 'wagmi';
import { obscureAddress, obscureEnsName, obscureLabel } from '../helpers/String';
   
function OwnerLinkLabel({owner}) { 
  const { isConnected, address } = useAccount();   
  const { data: ensName } = useEnsName({ address: owner?.id });

  return (
    <Link
        className="text-decoration-none link-dark"  
        title={"Domains of "+ owner?.id +""}
        to={"/account/"+ owner?.id }> 
            {isConnected && address.toLowerCase() === owner?.id.toLowerCase()? "You" : (ensName? obscureEnsName(ensName): obscureAddress(owner?.id || ""))}
    </Link>   
  )
}

export default OwnerLinkLabel;

