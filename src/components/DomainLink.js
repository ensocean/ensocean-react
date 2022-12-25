
import { Link } from 'react-router-dom'; 
import { isAscii, isValidName } from '../helpers/String'; 
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; 
import { DashCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';

function DomainLink({domain, label}) {  
    return ( 
        <Link className="text-decoration-none link-dark fs-5 fw-bold text-truncate p-0 lh-0"
            title={"View "+ domain.label || label + "." + domain.extension +"on EnsOcean"}
            to={"/"+ encodeURIComponent(domain.label)  + "."+ domain.extension }
            >
            
            {domain.label}.{domain.extension || "eth"}
        
            { ' ' }
                
            { !isAscii(domain.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Include non-ascii characters</Tooltip>}>
                    <ExclamationTriangleFill className='text-warning' width={12} height={12} />
                </OverlayTrigger>
            }
                
            { ' ' }

            { !isValidName(domain.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Malformed domain</Tooltip>}>
                    <DashCircleFill className='text-danger' width={12} height={12} />
                </OverlayTrigger>
            } 
        </Link>
    )
}

export default DomainLink;


