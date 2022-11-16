import React from "react"; 
import { useLocation  } from "react-router-dom";
import Filter from "./partials/Filter";
import {Helmet} from "react-helmet"; 
import { Link } from "react-router-dom"; 
  
let pageTitle = "Browse"; 

const Discover = () => { 
    const location = useLocation();

    const query = new URLSearchParams(location.search);  
    let tab = query.get("tab") ||  "all";

    if(tab === "expired") {  
        pageTitle = "Recently Expired"; 
    } else if(tab === "expiring") {  
        pageTitle = "Expiring Soon"; 
    } else if(tab === "premium") { 
        pageTitle = "Premium Right Now"; 
    } else if(tab === "registered") { 
        pageTitle = "Recently Registered"; 
    } else {
        pageTitle = "Browse"; 
    }

    return (
        <>
        <Helmet> 
            <title>Browse Ethereum Name Service (ENS) Domains - EnsOcean</title>
            <meta name="description" content="Browse Ethereum Name Service (ENS) domains easily. Find your web3 domain name idea. " />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>{pageTitle}</h1>
            </div> 
        </div>
        <div className="container-fluid p-0 m-0">
            <div className="card text-center">
                <div className="card-header border-0">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <Link className={"nav-link fs-5 p-3 "+ (tab === "all" ? "active": "") } to="/discover?tab=all">All</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link fs-5 p-3 "+ (tab === "expired" ? "active": "")} to="/discover?tab=expired">Expired</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link fs-5 p-3 "+ (tab === "expiring" ? "active": "")} to="/discover?tab=expiring">Expiring</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={" nav-link fs-5 p-3 "+ (tab === "premium" ? "active": "")} to="/discover?tab=premium">Premium</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link fs-5  p-3 "+ (tab === "registered" ? "active": "")} to="/discover?tab=registered">Recently Registered</Link>
                        </li> 
                    </ul> 
                </div>
                <div className="card-body">
                    <Filter  />
                </div>
            </div>
        </div> 
        </>
    ) 
};

 
  
export default Discover;