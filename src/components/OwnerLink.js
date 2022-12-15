import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { obscureAddress } from '../helpers/String';
   
function OwnerLink({owner}) { 
  const { isConnected, address } = useAccount();   
  return (
    <Link
        className="text-decoration-none link-dark btn btn-outline-warning"  
        title={"Domains of "+ owner.id +""}
        to={"/account/"+ owner.id }> 
            {isConnected && address.toLowerCase() === owner.id.toLowerCase()? "You" : obscureAddress(owner.id || "", 20)}
    </Link> 
  )
}

export default OwnerLink;

