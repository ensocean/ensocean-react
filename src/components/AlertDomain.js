import {isExpired, isExpiring, isPremium, isValidName } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import AddToWatchlistSmallButton from './AddToWatchlistSmallButton';
import ViewYourCartButton from './ViewYourCartButton';
   
function AlertDomain({domain}) { 
    
    return (
        <>
        { isValidName(domain.label) && isExpired(domain.expires) && 
            <div className="alert alert-success d-flex flex-column flex-md-row justify-content-center gap-3 align-items-center">
                <h4 className='mb-0'>Available for registration!</h4>
                <div className='d-flex flex-row gap-2'>
                    <AddToCartButton domain={domain} />
                    <ViewYourCartButton domain={domain} />
                </div>
            </div> 
        }
        
        { isValidName(domain.label) && isPremium(domain.expires) && 
            <div className="alert alert-success d-flex flex-column flex-md-row justify-content-start gap-3 align-items-center">
                <h4 className='mb-0'>Available for Premium registration!</h4>
                <div className='d-flex flex-row gap-2'>
                    <AddToCartButton domain={domain} />
                    <ViewYourCartButton domain={domain} />
                </div>
            </div> 
        } 
        
        { isValidName(domain.label) && isExpiring(domain.expires) && 
            <div className="alert alert-warning d-flex flex-column flex-md-row justify-content-start gap-3 align-items-center">
                <h4 className='mb-0'>About to Expire!</h4>
                <div className='d-flex flex-row gap-2'>
                    <AddToWatchlistSmallButton domain={domain} /> 
                </div>
            </div>
        } 
         
        { !isValidName(domain.label) &&
            <div className="alert alert-danger">
                <h4 className='mb-0'>Malformed!</h4>
            </div>
        }
        </>
    )
}

export default AlertDomain;


