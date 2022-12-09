

import { getExpires, getTimeAgo, isAvailable, isExpired, isExpiring, isPremium } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import AddToCartSmallButton from './AddToCartSmallButton';

function DomainStatus({domain, label = "", loading = false, showBadge=true, showAddToCartButton = false, showNotAvailable=false, showRegistered=false, showExpires=false}) {  
    
    if(showBadge) {
        return (
            <> 
                {loading && <div className="spinner-border spinner-border-sm"></div>}
                {!loading && domain.valid !== undefined && !domain.valid && <span className="float-end text-danger mt-2 mt-lg-0 fw-boldr">Invalid</span>}
                {!loading && isPremium(domain.expires) && 
                    <>
                        <span className="float-end text-success mt-2 mt-lg-0 fw-bold"> Premium Available </span>
                        {showAddToCartButton && <AddToCartSmallButton domain={domain} />}
                    </>
                    }
                {!loading && isExpiring(domain.expires) && <span className="float-end text-warning mt-2 mt-lg-0"> In grace period </span>}
                {!loading && isExpired(domain.expires) && 
                    <> 
                        <span className="float-end text-success mt-2 mt-lg-0 fw-bold">  AVAILABLE  </span>
                        {showAddToCartButton && <AddToCartSmallButton domain={domain} />}
                    </>
                }
                {showNotAvailable && !isAvailable(domain.expires) && <strong className="float-end text-muted mt-2 mt-lg-0"> Not Available </strong>}
                {showRegistered && !isExpiring(domain.expires) && !isAvailable(domain.expires) && <span className="float-end text-muted mt-2 mt-lg-0">{getTimeAgo(domain.registered)}</span>}
                {showExpires && !isExpiring(domain.expires) && !isAvailable(domain.expires) && <small className="text-muted"> Expires {  getExpires(domain.expires, false) } </small>}
            </> 
        )
    } else {
        return (<></>)
    }
}

export default DomainStatus; 