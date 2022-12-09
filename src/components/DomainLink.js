
import { Link } from 'react-router-dom'; 
import { getTimeAgo, isAscii, isExpired, isExpiring, isPremium, isValidName, obscureLabel } from '../helpers/String';
import exclamationTriangleFill from "../assets/exclamation-triangle-fill.svg";
import dashCircleFill from "../assets/dash-circle-fill.svg";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AddToCardSmall from './AddToCardSmall';

function DomainLink({domain, label, loading = false, showBadge = true, showRegistered=false, showNotAvailable=false, showAddToCartButton=false}) {  
   
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between"> 
            <Link
                className="text-decoration-none link-dark fs-5 fw-bold text-truncate"
                title={"View "+ domain.label || label + "." + domain.extension +"on EnsOcean"}
                to={"/"+ encodeURIComponent(domain.label)  + "."+ domain.extension }
                >
                
                {obscureLabel(domain.label || label, 20)}.{domain.extension || "eth"}
            
                { ' ' }
                    
                { !isAscii(domain.label || label) && 
                    <OverlayTrigger overlay={<Tooltip placement="top" className="in">Include non-ascii characters</Tooltip>}>
                        <span>
                            <img src={exclamationTriangleFill} alt= "" />
                        </span>
                    </OverlayTrigger>
                }
                    
                { ' ' }
    
                { !isValidName(domain.label || label) && 
                    <OverlayTrigger overlay={<Tooltip placement="top" className="in">Malformed domain</Tooltip>}>
                        <span>
                            <img src={dashCircleFill} alt= ""  />
                        </span>
                    </OverlayTrigger>
                } 
            </Link>   
                
            <div className='d-flex flex-row justify-content-start gap-3'>
                {showBadge && (function() {
                    if(loading) {
                        return (<div className="spinner-border spinner-border-sm"></div>)
                    }  else if(domain.valid !== undefined && !domain.valid) {
                        return (<span className="float-end text-danger mt-2 mt-lg-0 fw-boldr">Invalid</span> )
                    } else if (isPremium(domain.expires) ) {
                        return (<span className="float-end text-success mt-2 mt-lg-0 fw-bold"> Premium Available </span>)
                    } else if(isExpiring(domain.expires)) {
                        return (<span className="float-end text-warning mt-2 mt-lg-0"> In grace period </span>)
                    } else if(isExpired(domain.expires)) {
                        return (<span className="float-end text-success mt-2 mt-lg-0 fw-bold">  AVAILABLE  </span>)
                    } else {
                        if(showNotAvailable)
                            return (<span className="float-end text-muted mt-2 mt-lg-0"> Not Available </span>)
                    }
                })()}  

                {showRegistered && <span className="float-end text-muted mt-2 mt-lg-0">{getTimeAgo(domain.registered)}</span>}
                <span>
                {showAddToCartButton && <AddToCardSmall domain={domain} />}
                </span>
            </div>
        </div> 
    ) 
}

export default DomainLink;


