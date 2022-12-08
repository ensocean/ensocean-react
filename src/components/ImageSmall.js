
import spinner from '../assets/spinner.svg'
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getTokenId } from '../helpers/String';
import notAvailable from "../assets/not-available.svg";

function ImageSmall({domain, label, width, height}) {  
  const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;
  const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS;
 
    return (<LazyLoadImage
        alt={domain.label || label} 
        className="img-fluid card-img-top card-img-bottom"
        onError={(e)=> { e.target.src = notAvailable; }}
        placeholder={<img src={spinner} className="img-fluid card-img-top card-img-bottom" alt="" />}
        placeholderSrc={spinner}
        width={width || 46}
        height={height || 46}
        src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label || label)) }
    />)
}

export default ImageSmall;

