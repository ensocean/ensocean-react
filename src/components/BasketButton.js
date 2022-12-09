

import React, {useState, useEffect} from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import bagIcon from "../assets/bag.svg";
import bagFillIcon from "../assets/bag.svg";

function BasketButton({width, height}) {   
    const { isEmpty, totalUniqueItems } = useCart();
      
    return (
        <OverlayTrigger placement="top"  overlay={<Tooltip>View Your Cart</Tooltip>} >
            <Link className="btn btn-default position-relative" to="/register">
                <img src={isEmpty ? bagIcon: bagFillIcon} width={width || 28} height={height || 28 } />
                {totalUniqueItems > 0 && 
                    <small className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger">
                        {totalUniqueItems}
                    </small>
                }
            </Link>
        </OverlayTrigger>
    ) 
}

export default BasketButton;

