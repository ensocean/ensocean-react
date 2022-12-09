

import { getExpires, getTimeAgo, isAvailable, isExpired, isExpiring, isPremium, isValidName } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import AddToCartSmallButton from './AddToCartSmallButton';

function DomainStatus({domain, label = "", loading = false, showBadge=true, showAddToCartButton = false, showNotAvailable=false, showRegistered=false, showExpires=false}) {  
    
    if(showBadge) {
        return ( 
            <>
                {loading && <div className="spinner-border spinner-border-sm"></div>}
                {!loading && !isValidName(domain.label) && <span className="text-danger fw-boldr">Invalid</span>}
                {!loading && isValidName(domain.label) && isPremium(domain.expires) && 
                    <>
                        <span className="fw-bold text-success"> Premium </span>
                        {showAddToCartButton && <AddToCartSmallButton domain={domain} />}
                    </>
                    }
                {!loading && isValidName(domain.label) && isExpiring(domain.expires) && <span className="text-warning"> In grace period </span>}
                {!loading && isValidName(domain.label) && isExpired(domain.expires) && 
                    <> 
                        <span className="fw-bold text-success">  AVAILABLE  </span>
                        {showAddToCartButton && <AddToCartSmallButton domain={domain} />}
                    </>
                }
                {showNotAvailable && isValidName(domain.label) &&  !isExpiring(domain.expires) && !isAvailable(domain.expires) && <strong className="float-end text-muted"> Not Available </strong>}
                {showRegistered && isValidName(domain.label) && !isExpiring(domain.expires) && !isAvailable(domain.expires) && <span className="float-end text-muted">{getTimeAgo(domain.registered)}</span>}
                {showExpires && isValidName(domain.label) && !isExpiring(domain.expires) && !isAvailable(domain.expires) && <small className="text-muted"> Expires {  getExpires(domain.expires, false) } </small>}
                </>
        )
    } else {
        return (<></>)
    }
}

export default DomainStatus; 