

import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Heart, HeartFill } from "react-bootstrap-icons";
import Numeral from "react-numeral";
import { Link, useNavigate } from "react-router-dom";
import { useWatchlist } from "react-use-watchlist";
import { useAccount } from "wagmi";

function WatchlistButton() {   
    const { isConnected, address } = useAccount();   
    const { isEmpty, totalUniqueItems } = useWatchlist();
    const { openConnectModal } = useConnectModal(); 
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        if(!isConnected) {
            openConnectModal();
        } else {
            navigate("/account/"+ address +"?tab=watchlist");
        }
    }

    return (
        <OverlayTrigger placement="bottom" overlay={<Tooltip>View Your Watchlist</Tooltip>} >
            <Link className={"text-decoration-none link-dark d-flex flex-row align-items-center gap-1 position-relative"}  onClick={handleClick}>
                {isEmpty ? <Heart width={24} height={24} /> : <HeartFill width={24} height={24} />}
                Watchlist
                {totalUniqueItems > 0 && 
                    <small className="position-absolute top-0 start-0 ms-1 translate-middle badge rounded-pill bg-danger">
                        <Numeral value={totalUniqueItems} format={"0,0"} />
                    </small>
                }
            </Link>
        </OverlayTrigger>
    ) 
}

export default WatchlistButton;

