

import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import bagIcon from "../assets/bag.svg";
import bagFillIcon from "../assets/bag.svg";

function BasketButton({width, height}) {   
    const { isEmpty, totalUniqueItems } = useCart();
      
    return (
        <Link className="me-3 position-relative" to="/register" title="Your Cart">
            <img src={isEmpty ? bagIcon: bagFillIcon} width={width || 28} height={height || 28 } />
            {totalUniqueItems > 0 && 
                <small className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalUniqueItems}
                </small>
            }
        </Link>
    ) 
}

export default BasketButton;

