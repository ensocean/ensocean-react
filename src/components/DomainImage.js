
import spinner from '../assets/spinner.svg'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getTokenId } from '../helpers/String';
import notAvailable from "../assets/not-available.svg";
 
const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;

function DomainImage({domain, label}) {   
     
    if(domain) {
        return (
            <>  
                <LazyLoadImage
                    alt={domain?.label} 
                    className="img-fluid card-img-top" 
                    onError={(e)=> { document.getElementById(domain?.id || getTokenId(label))?.remove(); e.target.src = notAvailable; e.target.alt="Not available" }}
                    afterLoad={(e)=> { document.getElementById(domain?.id || getTokenId(label))?.remove(); }}
                    src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain?.label)) }
                /> 
                <img id={domain.id} src={spinner} className="img-fluid card-img-top card-img-bottom" alt="" />
            </>);
    } else {
        return (
            <>  
                <LazyLoadImage
                    alt={label} 
                    className="img-fluid card-img-top" 
                    onError={(e)=> { document.getElementById(getTokenId(label))?.remove(); e.target.src = notAvailable; e.target.alt="Not available" }}
                    afterLoad={(e)=> { document.getElementById(getTokenId(label))?.remove(); }}
                    src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(label)) }
                /> 
                <img id={getTokenId(label)} src={spinner} className="img-fluid card-img-top card-img-bottom" alt="" />
            </>);
    }
}
    
export default DomainImage;
                            
                            