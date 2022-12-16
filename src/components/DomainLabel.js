

import { isAscii, isValidName, obscureLabel } from '../helpers/String'; 
import dashCircleFill from "../assets/dash-circle-fill.svg";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DashCircleFill, ExclamationTriangleFill } from 'react-bootstrap-icons';
 
function DomainLabel({domain, label}) {  
   
    return (
        <> 
            {obscureLabel(domain?.label || label, 35)}.{domain?.extension || "eth"}
        
            { ' ' }
                
            { !isAscii(domain?.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Include non-ascii characters</Tooltip>}>
                   <ExclamationTriangleFill className='text-warning' />
                </OverlayTrigger>
            }
                
            { ' ' }

            { !isValidName(domain?.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Malformed domain</Tooltip>}>
                    <DashCircleFill className='text-danger'  />
                </OverlayTrigger>
            }   
        </> 
    ) 
}

export default DomainLabel;


