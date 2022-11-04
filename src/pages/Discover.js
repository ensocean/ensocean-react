import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Discover = () => {
    const [albums, setAlbums] = useState([]);
    const query = new URLSearchParams(useLocation().search);
    const tab = query.get("tab");
    switch(tab) {
        case "all":
            return All();
            break;
        case "expired":
            return Expired();
            break;
        case "premium":
            return Premium();
            break;
        case "expiring":
            return Expiring();
            break;
        case "registered":
            return NewRegistered();
            break;
        default:
            return All();
            break;
    }
};

const All = () => {
    return Page("All Domains", "all")
}

const Expired = () => {
    return Page("Expired", "expired")
}

const Premium = () => {
    return Page("Premium", "premium")
}

const Expiring = () => {
    return Page("Expiring",  "expiring")
}
 
const NewRegistered = () => {
    return Page("Recently Registered", "registered")
}
  
const Page = (pageTitle, tab) => {
    return (
        <>
        <div className="container-fluid bg-primary mb-4">
            <div className="container text-center p-3 text-white">
                <h1>{pageTitle}</h1>
            </div> 
        </div>
        <div className="container-fluid">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link className={"flex-sm-fill text-sm-center nav-link "+ (tab == "all" ? "active": "") } to="/discover?tab=all">All</Link>
                </li>
                <li className="nav-item">
                    <Link className={"flex-sm-fill text-sm-center nav-link "+ (tab == "registered" ? "active": "")} to="/discover?tab=registered">Recently Registered</Link>
                </li>
                <li className="nav-item">
                    <Link className={"flex-sm-fill text-sm-center nav-link "+ (tab == "premium" ? "active": "")} to="/discover?tab=premium">Premium</Link>
                </li>
                <li className="nav-item">
                    <Link className={"flex-sm-fill text-sm-center nav-link "+ (tab == "expiring" ? "active": "")} to="/discover?tab=expiring">Expiring</Link>
                </li>
                <li className="nav-item">
                    <Link className={"flex-sm-fill text-sm-center nav-link "+ (tab == "expired" ? "active": "")} to="/discover?tab=expired">Expired</Link>
                </li>
            </ul>
        </div>
        </>
    );
}

export default Discover;