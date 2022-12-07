import React from "react"; 
import { useLocation  } from "react-router-dom";
import Filter from "./partials/Filter";
import moment from 'moment'; 
import {Helmet} from "react-helmet"; 
import { Link } from "react-router-dom";

const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

let where = { label_not: null };
let pageTitle = "Browse";
let orderBy = "created";
let orderDirection = "desc";
let metaTitle = "Browse Ethereum Name Service (ENS) Domains";
let metaDescription = "Browse Ethereum Name Service (ENS) domains. Explore dropped domains. Find your web3 domain name idea. ";

const Discover = () => { 
    const location = useLocation();

    const query = new URLSearchParams(location.search);  
    const tab = query.get("tab");
  
    if(tab === "expired") {  
        metaTitle = "Dropped ENS Web3 Domains"
        metaDescription = "View all expired ENS domains. Catch and claim again for yourself easily."
        pageTitle = "Recently Expired";
        orderBy = "expires";
        orderDirection = "desc";
        where = { 
            label_not: null,
            expires_lte: moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix() 
        }
    } else if(tab === "expiring") {  
        metaTitle = "About To Expire Web3 Domains"
        metaDescription = "View all expiring ENS domains. Add them to your favorites and claim it for yourself in the future."
        pageTitle = "Expiring Soon";
        orderBy = "expires";
        orderDirection = "asc";
        where = { 
            label_not: null,
            expires_lte: moment().utc().unix(),
            expires_gte: moment().add(-PREMIUM_PERIOD, "days").utc().unix()
        };
    } else if(tab === "premium") { 
        metaTitle = "Premium Web3 Domains"
        metaDescription = "View all premium ENS domains. Claim it for yourself with an extra payment."
        pageTitle = "Premium Right Now";
        orderBy = "expires";
        orderDirection = "asc";
        where = { 
            label_not: null,
            expires_lte: moment().add(-GRACE_PERIOD, "days").utc().unix(),
            expires_gte: moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix()
        }
    } else if(tab === "registered") { 
        metaTitle = "Registered Web3 Domains"
        metaDescription = "View all registered ENS domains. See who is claiming which domains."
        pageTitle = "Recently Registered";
        orderBy = "registered";
        orderDirection = "desc";
        where = { 
            label_not: null,
            registered_not: null
        }
    } else {
        metaTitle = "Browse Web3 Domains"
        metaDescription = "View all ENS domains. Find your web3 domain name idea."
        pageTitle = "Browse";
        orderBy = "created";
        orderDirection = "desc";
        where = { 
            label_not: null
        }
    }

    return (
        <>
        <Helmet> 
            <title>{metaTitle} - EnsOcean</title>
            <meta name="description" content={metaDescription} />
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
                            <Link className={"nav-link fs-5 p-3 "+ (tab === "all" || tab === null || tab === "" ? "active": "") } to="/discover?tab=all">All</Link>
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
                <div className="card-body p-2">
                    <Filter First={100} Skip={0} Tab={tab} OrderBy={orderBy} OrderDirection={orderDirection} Where={where} View="gallery" />
                </div>
            </div>
        </div> 
        </>
    ) 
};

 
  
export default Discover;