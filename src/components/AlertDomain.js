import { useAccount, useNetwork } from 'wagmi';
import { isExpired, isExpiring, isPremium, isValidName } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import ViewYourCartButton from './ViewYourCartButton';
   
function AlertDomain({domain, label}) { 
  
    return (
        <>
        { isExpired(domain.expires) && 
            <div className="alert alert-success d-flex flex-row justify-content-start gap-3 align-items-center">
                <strong>Available for registration!</strong>
                <AddToCartButton domain={domain} />
                <ViewYourCartButton domain={domain} />
            </div> 
        }
        
        { isPremium(domain.expires) && 
            <div className="alert alert-success d-flex flex-row justify-content-start gap-3 align-items-center">
                <strong>Available for Premium registration!</strong>
                <AddToCartButton domain={domain} />
                <ViewYourCartButton domain={domain} />
            </div> 
        } 
        
        { isExpiring(domain.expires) && 
            <div className="alert alert-warning">About to Expire!</div>
        } 
        
        { !isValidName(domain.label || label) &&
            <div className="alert alert-danger">Malformed!</div>
        }
        </>
    )
}

export default AlertDomain;


