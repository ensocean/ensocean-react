

import { getExpires, getTimeAgo, isAvailable, isExpired, isExpiring, isPremium, isValidName } from '../helpers/String';

function DomainStatus({domain, loading = false, showBadge=true, showNotAvailable=false, showRegistered=false, showExpires=false}) {  
    if(showBadge) {
        return ( 
            <div className='d-flex flex-row justify-content-start align-items-center gap-3'>
                {loading && <div className="spinner-border spinner-border-sm"></div>}
                {!loading && !isValidName(domain.label) && <span className="text-danger fw-boldr">Invalid</span>}
                {!loading && isValidName(domain.label) && isPremium(domain.expires) && 
                    <>
                        <span className="fw-bold text-success"> PREMIUM AVAILABLE </span>
                    </>
                }
                {!loading && isValidName(domain.label) && isExpiring(domain.expires) && 
                    <span className="text-warning"> In grace period </span>
                }
                {!loading && isValidName(domain.label) && isExpired(domain.expires) && 
                    <> 
                        <span className="fw-bold text-success">  AVAILABLE  </span> 
                    </>
                }
                {showNotAvailable && isValidName(domain.label) &&  !isExpiring(domain.expires) && !isAvailable(domain.expires) && <strong className="float-end text-muted"> Not Available </strong>}
                {showRegistered && isValidName(domain.label) && !isExpiring(domain.expires) && !isAvailable(domain.expires) && <span className="float-end text-muted">{getTimeAgo(domain.registered)}</span>}
                {showExpires && isValidName(domain.label) && !isExpiring(domain.expires) && !isAvailable(domain.expires) && <small className="text-muted"> Expires {  getExpires(domain.expires, false) } </small>}
            </div>
        )
    } else {
        return (<></>)
    }
}

export default DomainStatus; 