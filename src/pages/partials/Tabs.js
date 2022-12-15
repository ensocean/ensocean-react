import React from "react"; 
import { Link } from "react-router-dom";

const Tabs = ({tab}) => { 
    return (
        <ul className="nav card-header-tabs">
            <li className="nav-item">
                <Link className={"nav-link fs-5 p-3 "+ (tab === "all" || tab === null || tab === "" ? "active": "") } to="/discover?tab=all">All</Link>
            </li>
            <li className="nav-item">
                <Link className={"nav-link fs-5 p-3 "+ (tab === "expired" ? "active": "")} to="/expired">Expired</Link>
            </li>
            <li className="nav-item">
                <Link className={"nav-link fs-5 p-3 "+ (tab === "expiring" ? "active": "")} to="/expiring">Expiring</Link>
            </li>
            <li className="nav-item">
                <Link className={" nav-link fs-5 p-3 "+ (tab === "premium" ? "active": "")} to="/premium">Premium</Link>
            </li>
            <li className="nav-item">
                <Link className={"nav-link fs-5  p-3 "+ (tab === "registered" ? "active": "")} to="/registered">Recently Registered</Link>
            </li> 
        </ul>
    )
}

export default Tabs;