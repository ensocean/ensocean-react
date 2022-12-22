

import { useConnectModal } from "@rainbow-me/rainbowkit";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Bag, BagFill } from "react-bootstrap-icons";
import Numeral from "react-numeral";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterlist } from "react-use-registerlist"; 
import { useAccount } from "wagmi";

function BasketButton() {   
    const { isEmpty, totalUniqueItems } = useRegisterlist();
    const { isConnected, address } = useAccount();   
    const { openConnectModal } = useConnectModal(); 
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        if(!isConnected) {
            openConnectModal();
        } else {
            navigate("/register");
        }
    }

    return (
        <OverlayTrigger placement="bottom"  overlay={<Tooltip>View Your Cart</Tooltip>} >
            <Link className={"text-decoration-none d-flex flex-row align-items-center gap-1 position-relative"}  onClick={handleClick}>
                {isEmpty ? <Bag />: <BagFill />}
                Registration
                {totalUniqueItems > 0 && 
                    <small className="position-absolute top-0 start-100 ms-1 translate-middle badge rounded-pill bg-danger">
                        <Numeral value={totalUniqueItems} format={"0,0"} />
                    </small>
                }
            </Link>
        </OverlayTrigger>
    ) 
}

export default BasketButton;

