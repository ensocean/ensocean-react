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
import DomainImage from "./DomainImage";
import AddToCartButton from "./AddToCartButton";
import AddToCartSmallButton from "./AddToCartSmallButton";
import AddToFavoritesSmallButton from "./AddToFavoritesSmallButton";
import { CartProvider } from "react-use-cart";


function DomainCard({domain, label}) { 
    return (
        
            <div className="card g-card">  
                <div className="card-body p-0">
                    <Link className="text-decoration-none link-dark fw-bold fs-5" title={"View "+ domain.label + "." + domain.extension +" on EnsOcean"} to={"/"+ encodeURIComponent(domain.label) + "."+ domain.extension }>
                        <div className="card text-start border-0">
                            <DomainImage domain={domain} />
                            <div className="card-body p-2">
                                <h6 className="card-title m-0 text-truncate fs-5 fw-bold">
                                    <DomainLink domain={domain} showBadge={false} showAddToCartButton={true} />
                                </h6>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="p-2 d-flex flex-column justify-content-between gap-2">
                    <DomainStatus domain={domain} showExpires={true} />
                </div>
                <div className="card-footer bg-white text-start p-2 ">
                    <AddToCartSmallButton domain={domain} />
                    <CartProvider id="ensocean_favorites" key="ensocean_favorites">
                        <AddToFavoritesSmallButton domain={domain} />
                    </CartProvider>
                </div>
            </div> 
    )
}

export default DomainCard;



