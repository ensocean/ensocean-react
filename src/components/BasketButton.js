

import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Bag, BagFill } from "react-bootstrap-icons";
import Numeral from "react-numeral";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart"; 

function BasketButton({width, height, smallButton = false}) {   
    const { isEmpty, totalUniqueItems } = useCart();
      
    return (
        <OverlayTrigger placement="bottom"  overlay={<Tooltip>View Your Cart</Tooltip>} >
            <Link className={"btn btn-default position-relative "+ (smallButton ? "btn-sm": "") }  to="/register">
                {isEmpty ? <Bag width={width || 28} height={height || 28 } />: <Bag width={width || 28} height={height || 28 } />}
                
                {totalUniqueItems > 0 && 
                    <small className="position-absolute top-50 start-75 translate-middle badge rounded-pill bg-danger">
                        <Numeral value={totalUniqueItems} format={"0,0"} />
                    </small>
                }
            </Link>
        </OverlayTrigger>
    ) 
}

export default BasketButton;

