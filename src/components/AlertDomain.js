import { useAccount, useNetwork } from 'wagmi';
import { getLabelHash, isAvailable, isExpired, isExpiring, isPremium, isValidName } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import ViewYourCartButton from './ViewYourCartButton';
   
function AlertDomain({domain, label}) { 
   
    if(!domain) {
        
        return (
            <>
            {isValidName(label) &&
            <div className="alert alert-success d-flex flex-column flex-md-row justify-content-center gap-3 align-items-center">
                <h4>Available for registration!</h4>
                <div className='d-flex flex-row gap-2'>
                    <AddToCartButton label={label}  />
                    <ViewYourCartButton label={label} />
                </div>
            </div> }
            </>
        )
    }
    return (
        <>
        { isExpired(domain.expires) && 
            <div className="alert alert-success d-flex flex-column flex-md-row justify-content-center gap-3 align-items-center">
                <h4>Available for registration!</h4>
                <div className='d-flex flex-row gap-2'>
                    <AddToCartButton domain={domain} />
                    <ViewYourCartButton domain={domain} />
                </div>
            </div> 
        }
        
        { isPremium(domain.expires) && 
            <div className="alert alert-success d-flex flex-column flex-md-row justify-content-start gap-3 align-items-center">
                <h4>Available for Premium registration!</h4>
                <div className='d-flex flex-row gap-2'>
                    <AddToCartButton domain={domain} />
                    <ViewYourCartButton domain={domain} />
                </div>
            </div> 
        } 
        
        { isExpiring(domain.expires) && 
            <div className="alert alert-warning">
                <h4>About to Expire!</h4>
            </div>
        } 
         
        { !isValidName(domain.label) &&
            <div className="alert alert-danger">
                <h4>Malformed!</h4>
            </div>
        }
        </>
    )
}

export default AlertDomain;


