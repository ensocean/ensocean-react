
import { Link } from 'react-router-dom'; 
import { getTimeAgo, isAscii, isAvailable, isExpired, isExpiring, isPremium, isValidName, obscureLabel } from '../helpers/String';
import exclamationTriangleFill from "../assets/exclamation-triangle-fill.svg";
import dashCircleFill from "../assets/dash-circle-fill.svg";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import DomainStatus from './DomainStatus';

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
                <DomainStatus loading={loading} domain={domain} showBadge={showBadge} showRegistered={showRegistered} showAddToCartButton={showAddToCartButton} showNotAvailable={showNotAvailable} />
            </div>
        </div> 
    ) 
}

export default DomainLink;


