
import { Link } from 'react-router-dom'; 
import { getTimeAgo, isAscii, isExpired, isExpiring, isPremium, isValidName, obscureLabel } from '../helpers/String';
import exclamationTriangleFill from "../assets/exclamation-triangle-fill.svg";
import dashCircleFill from "../assets/dash-circle-fill.svg";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function DomainLink({domain, label, showAvability = true}) {  
  
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
                
            {showAvability && (function() {
                if (isPremium(domain.expires) ) {
                    return (<span className="float-end text-success mt-2 mt-lg-0 fw-bold"> Premium Available </span>)
                } else if(isExpiring(domain.expires)) {
                    return (<span className="float-end text-warning mt-2 mt-lg-0"> In grace period </span>)
                } else if(isExpired(domain.expires)) {
                    return (<span className="float-end text-success mt-2 mt-lg-0 fw-bold">  AVAILABLE  </span>)
                } else {
                    return (<small className="float-end text-muted mt-2 mt-lg-0"> {getTimeAgo(domain.registered)} </small>)
                }
            })()}  
        </div> 
   )
}

export default DomainLink;


