
import { Link } from 'react-router-dom'; 
import { isAscii, isValidName, obscureLabel } from '../helpers/String'; 
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; 
import { DashCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';

function DomainLink({domain, label}) {  
    return ( 
        <Link className="text-decoration-none link-dark fs-5 fw-bold text-truncate p-0 lh-0"
            title={"View "+ domain.label || label + "." + domain.extension +"on EnsOcean"}
            to={"/"+ encodeURIComponent(domain.label)  + "."+ domain.extension }
            >
            
            {obscureLabel(domain.label || label, 30)}.{domain.extension || "eth"}
        
            { ' ' }
                
            { !isAscii(domain.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Include non-ascii characters</Tooltip>}>
                    <ExclamationTriangleFill className='text-warning' />
                </OverlayTrigger>
            }
                
            { ' ' }

            { !isValidName(domain.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Malformed domain</Tooltip>}>
                    <DashCircleFill className='text-danger' />
                </OverlayTrigger>
            } 
        </Link>
    )
}

export default DomainLink;


