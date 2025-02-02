



import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react"; 
import Numeral from "react-numeral";
import { Link } from "react-router-dom";
import { useWatchlist } from "react-use-watchlist"; 
import { useAccount } from 'wagmi';  

function WatchlistLink() {   
    const { isConnected, address } = useAccount();   
    const { totalUniqueItems } = useWatchlist();
    const { openConnectModal } = useConnectModal(); 

    const handleConnect = (e) => {
        e.preventDefault();
        openConnectModal();
    }
      
    return ( 
        <>
            {isConnected && 
            <Link className="nav-link fw-bold" to={"/account/"+ address +"?tab=watchlist"}>
                Watchlist {" "}
                <small className="translate-middle ms-2 badge rounded-pill bg-danger">
                    <Numeral value={totalUniqueItems} format={"0,0"} />
                </small>
            </Link>}
            {!isConnected && 
            <Link className="nav-link fw-bold" onClick={handleConnect}>
                Watchlist {" "}
                <small className="translate-middle ms-2 badge rounded-pill bg-danger">
                    <Numeral value={totalUniqueItems} format={"0,0"} />
                </small>
            </Link>}
        </>
    ) 
}

export default WatchlistLink;


