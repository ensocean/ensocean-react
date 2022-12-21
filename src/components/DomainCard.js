import { Link } from "react-router-dom"; 
import DomainLabel from "./DomainLabel";
import DomainStatus from "./DomainStatus"; 
import DomainImage from "./DomainImage"; 
import AddToCartSmallButton from "./AddToCartSmallButton";
import AddToWatchlistSmallButton from "./AddToWatchlistSmallButton"; 


function DomainCard({domain, label, loading}) { 
    if(loading) {
        return (
            <>
                {[...Array(12)].map((x, i) =>
                    <div className="col mb-3 p-1 placeholder-glow" key={i}>
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
            </>  
        )
    } else {
        return ( 
            <div className="card g-card border border-light bg-light shadow-sm">  
                <div className="card-body p-0">
                    <Link className="text-decoration-none link-dark fw-bold fs-5" title={"View "+ domain.label + "." + domain.extension +" on EnsOcean"} to={"/"+ encodeURIComponent(domain.label) + "."+ domain.extension }>
                        <div className="card border-0 text-start">
                            <DomainImage domain={domain} />
                            <div className="card-body p-2">
                                <h6 className="card-title m-0 text-truncate fs-5 fw-bold">
                                    <DomainLabel domain={domain} showBadge={false} showAddToCartButton={true} />
                                </h6>
                            </div>
                            <div className="card-img-overlay">
                                
                            </div>
                        </div>
                    </Link>
                </div> 
                <div className="card-footer bg-light text-start p-2 bg-light">
                    <div className="d-flex flex-column">
                        <DomainStatus domain={domain} showExpires={true} /> 
                        <div className="d-flex flex-row justify-content-end gap-2 align-items-center mt-1">
                            <AddToCartSmallButton domain={domain} /> 
                            <AddToWatchlistSmallButton domain={domain} /> 
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
    
}

export default DomainCard;



