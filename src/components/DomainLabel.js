

import { isAscii, isValidName, obscureLabel } from '../helpers/String';
import exclamationTriangleFill from "../assets/exclamation-triangle-fill.svg";
import dashCircleFill from "../assets/dash-circle-fill.svg";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
 
function DomainLabel({domain, label}) {  
   
    return (
        <> 
            {obscureLabel(domain?.label || label, 35)}.{domain?.extension || "eth"}
        
            { ' ' }
                
            { !isAscii(domain?.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Include non-ascii characters</Tooltip>}>
                    <span>
                        <img src={exclamationTriangleFill} alt= "" />
                    </span>
                </OverlayTrigger>
            }
                
            { ' ' }

            { !isValidName(domain?.label || label) && 
                <OverlayTrigger overlay={<Tooltip placement="top" className="in">Malformed domain</Tooltip>}>
                    <span>
                        <img src={dashCircleFill} alt= ""  />
                    </span>
                </OverlayTrigger>
            }   
        </> 
    ) 
}

export default DomainLabel;


