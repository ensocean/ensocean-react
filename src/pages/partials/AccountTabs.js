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
            <ul className="list-inline text-nowrap flex-nowrap overflow-scroll m-0 border-light border-2 border-bottom">
                <li className={"list-inline-item p-3 "+ (tab === "all" || tab === null || tab === "" ? "border-bottom border-primary border-2": "")}>
                    <Link className={"text-decoration-none link-secondary fs-5 p-3"} to={"/account/"+ account}>Collection</Link>
                </li>  
                {isConnected && address === addr &&
                <>
                    <li className={"list-inline-item p-3 "+ (tab === "watchlist" ? "border-bottom border-primary border-2": "")}>
                        <Link className={"text-decoration-none link-secondary fs-5  p-3"} to={"/account/"+ address +"?tab=watchlist"}>Watchlist</Link>
                    </li> 
                </>
                }
            </ul> 
        </>
    )
}

export default AccountTabs;