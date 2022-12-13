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
import AddToWatchlistSmallButton from "./AddToWatchlistSmallButton";
import { CartProvider } from "react-use-cart";


function DomainCard({domain, label, loading}) { 
    if(loading) {
        return (
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 placeholder-glow">
                {[...Array(12)].map((x, i) =>
                    <div className="col mb-3" key={i}>
                        <div className="card h-100 text-start">
                            <div className="card-body p-0"> 
                                <span className="placeholder w-100" style={{  minHeight: 167 }}></span>
                                <p className="card-text"> </p>
                            </div>
                            <div className="card-footer bg-white p-2 placeholder-wave">
                                <h6 className="card-title m-0 fw-bold">
                                    <span className="placeholder w-75"></span>
                                </h6>
                                <small className="text-muted placeholder-wave">
                                    <span className="placeholder w-50"></span>
                                </small>
                            </div>
                        </div>
                    </div> 
                )}
            </div>  
        )
    } else {
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
                    <AddToWatchlistSmallButton domain={domain} /> 
                </div>
            </div> 
        )
    }
    
}

export default DomainCard;



