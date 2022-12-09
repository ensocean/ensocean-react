import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { getExpires, getTokenId, isAscii, isExpired, isExpiring, isPremium, isValidName, obscureLabel } from "../helpers/String";
import exclamationTriangleFill from "../assets/exclamation-triangle-fill.svg";
import dashCircleFill from "../assets/dash-circle-fill.svg";
import notAvailable from "../assets/not-available.svg";
import spinner from '../assets/spinner.svg'
import DomainLabel from "./DomainLabel";
import DomainStatus from "./DomainStatus";
import DomainLink from "./DomainLink";

const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;

function DomainCard({domain, label}) { 
    return (
        
            <div className="card text-start g-card"> 
                <Link className="text-decoration-none link-dark fw-bold fs-5" title={"View "+ domain.label + "." + domain.extension +" on EnsOcean"} to={"/"+ encodeURIComponent(domain.label) + "."+ domain.extension }>
                    <LazyLoadImage
                        alt={domain.label} 
                        className="img-fluid card-img-top" 
                        onError={(e)=> { document.getElementById(domain.id)?.remove(); e.target.src = notAvailable; e.target.alt="Not available" }}
                        afterLoad={(e)=> { document.getElementById(domain.id)?.remove(); }}
                        src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label)) }
                    /> 
                    <img id={domain.id} src={spinner} className="img-fluid card-img-top" alt="" />
                </Link>
                <div className="card-body p-2">
                    <h6 className="card-title m-0 text-truncate fs-5 fw-bold">
                        <DomainLink domain={domain} showBadge={false} showAddToCartButton={true} />
                    </h6>
                </div>
                <div className="card-footer bg-white p-2 d-flex flex-column justify-content-between gap-2">
                    <DomainStatus domain={domain} showAddToCartButton={true} showExpires={true} />
                </div>
            </div> 
    )
}

export default DomainCard;



