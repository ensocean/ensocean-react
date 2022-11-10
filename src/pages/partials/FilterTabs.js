import {Link } from "react-router-dom"; 

const FilterTabs = ({tab}) => {
    return (
        <> 
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
        </>
    )
}

export default FilterTabs;