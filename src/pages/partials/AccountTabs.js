import React from "react"; 
import { Link, useLocation, useParams } from "react-router-dom";
import { useAccount } from 'wagmi';  

const AccountTabs = ({account}) => { 
    
    const addr = useParams().address;
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
 
    const { isConnected, address } = useAccount();   

    return (
        <> 
            <ul className="nav nav-tabs card-header-tabs flex-nowrap">
                <li className="nav-item">
                    <Link className={"nav-link fs-5 p-3 "+ (tab === "all" || tab === null || tab === "" ? "active": "") } to={"/account/"+ account}>Collection</Link>
                </li>  
                {isConnected && address === addr &&
                <li className="nav-item">
                    <Link className={"nav-link fs-5  p-3 "+ (tab === "watchlist" ? "active": "")} to={"/account/"+ address +"?tab=watchlist"}>Watchlist</Link>
                </li> 
                }
            </ul> 
        </>
    )
}

export default AccountTabs;