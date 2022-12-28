import {isExpired, isExpiring, isPremium, isValidName } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import AddToWatchlistSmallButton from './AddToWatchlistSmallButton';
import ViewYourCartButton from './ViewYourCartButton';
   
function AlertDomain({domain, label}) { 
    
    if(domain) {
        return (
            <>
            { isValidName(domain?.label || label) && isExpired(domain?.expires) && 
                <div className="alert alert-success d-flex flex-column flex-md-row justify-content-center gap-3 align-items-center">
                    <h4 className='mb-0'>Available for registration!</h4>
                    <div className='d-flex flex-row gap-2'>
                        <AddToCartButton domain={domain} />
                        <ViewYourCartButton domain={domain} />
                    </div>
                </div> 
            }
            
            { isValidName(domain?.label || label) && isPremium(domain?.expires) && 
                <div className="alert alert-success d-flex flex-column flex-md-row justify-content-start gap-3 align-items-center">
                    <h4 className='mb-0'>Available for Premium registration!</h4>
                    <div className='d-flex flex-row gap-2'>
                        <AddToCartButton domain={domain} />
                        <ViewYourCartButton domain={domain} />
                    </div>
                </div> 
            } 
            
            { isValidName(domain?.label || label) && isExpiring(domain?.expires) && 
                <div className="alert alert-warning d-flex flex-row flex-md-row justify-content-between gap-3 align-items-center">
                    <h4 className='mb-0'>About to Expire!</h4>
                    <div className='d-flex flex-row gap-2'>
                        <AddToWatchlistSmallButton domain={domain} /> 
                    </div>
                </div>
            } 
             
            { !isValidName(domain?.label || label) &&
                <div className="alert alert-danger">
                    <h4 className='mb-0'>Malformed!</h4>
                </div>
            }
            </>
        )
    } else {
        return (
            <>
                 { isValidName(domain?.label || label) &&
                    <div className="alert alert-success d-flex flex-column flex-md-row justify-content-center gap-3 align-items-center">
                        <h4 className='mb-0'>Available for registration!</h4>
                        <div className='d-flex flex-row gap-2'>
                            <AddToCartButton label={label} />
                            <ViewYourCartButton label={label} />
                        </div>
                    </div> 
                }
            </>
        )
    }
    
}

export default AlertDomain;


