import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { obscureAddress } from '../helpers/String';
   
function OwnerLink({domain}) { 
  const { isConnected, address } = useAccount();   
  return (
    <Link
        className="text-decoration-none link-dark btn btn-outline-warning"  
        title={"Domains of "+ domain.owner +""}
        to={"/account/"+ domain.owner }> 
            {isConnected && address.toLowerCase() === domain.owner.toLowerCase()? "You" : obscureAddress(domain.owner || "", 20)}
    </Link> 
  )
}

export default OwnerLink;

