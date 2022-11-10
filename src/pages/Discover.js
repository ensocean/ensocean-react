import React from "react";
import { useLocation } from "react-router-dom"; 
import {Helmet} from "react-helmet";
import Filter from "./partials/Filter";
import FilterResults from "./partials/FilterResults";
import FilterTabs from "./partials/FilterTabs";

const Discover = () => { 
    const query = new URLSearchParams(useLocation().search);
    const tab = query.get("tab");
    switch(tab) {
        case "all":
            return All(); 
        case "expired":
            return Expired(); 
        case "premium":
            return Premium(); 
        case "expiring":
            return Expiring(); 
        case "registered":
            return NewRegistered(); 
        default:
            return All(); 
    }
};

const All = () => {
    return Page("All Domains", "all")
}

const Expired = () => {
    return Page("Expired Domains", "expired")
}

const Premium = () => {
    return Page("Premium Domains", "premium")
}

const Expiring = () => {
    return Page("Expiring Domains",  "expiring")
}
 
const NewRegistered = () => {
    return Page("Registered Domains", "registered")
}
  
const Page = (pageTitle, tab) => {

    
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
                    <FilterTabs tab={tab} />
                </div>
                <div className="card-body">
                    <Filter tab={tab} /> 
                </div>
            </div>
        </div>
        </>
    );
}

export default Discover;