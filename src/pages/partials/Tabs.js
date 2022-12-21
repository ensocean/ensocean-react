import React from "react"; 
import { Link } from "react-router-dom";

const Tabs = ({tab}) => {  
    return (
        <ul className="list-inline text-nowrap flex-nowrap overflow-scroll m-0 border-light border-2 border-bottom">
            <li className={"list-inline-item p-3 "+ (tab === "all" ? "border-bottom border-primary border-2": "")}>
                <Link className={"text-decoration-none fs-5 "+ (tab === "all" ? "link-dark": "link-secondary")}  to="/discover?tab=all">All</Link>
            </li>
            <li  className={"list-inline-item p-3 "+ (tab === "expired" ? "border-bottom border-primary border-2": "")}>
                <Link className={"text-decoration-none fs-5 "+ (tab === "expired" ? "link-dark": "link-secondary")} to="/expired">Expired</Link>
            </li>
            <li  className={"list-inline-item p-3 "+ (tab === "expiring" ? "border-bottom border-primary border-2": "")}>
                <Link className={"text-decoration-none fs-5 "+ (tab === "expiring" ? "link-dark": "link-secondary")} to="/expiring">Expiring</Link>
            </li>
            <li  className={"list-inline-item p-3 "+ (tab === "premium" ? "border-bottom border-primary border-2": "")}>
                <Link className={"text-decoration-none fs-5 "+ (tab === "premium" ? "link-dark": "link-secondary")} to="/premium">Premium</Link>
            </li>
            <li  className={"list-inline-item p-3 "+ (tab === "registered" ? "border-bottom border-primary border-2": "")}>
                <Link className={"text-decoration-none fs-5 "+ (tab === "registered" ? "link-dark": "link-secondary")} to="/registered">Recently Registered</Link>
            </li> 
        </ul>
    )
}

export default Tabs;