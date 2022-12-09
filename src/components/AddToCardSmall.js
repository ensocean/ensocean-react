

import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X, Cart4, ThreeDotsVertical } from "react-bootstrap-icons";
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";

function AddToCardSmall({domain}) {   
    
    var _domain = JSON.parse(JSON.stringify(domain));
    _domain.price = 0;
    Object.preventExtensions(_domain);

    const { addItem, removeItem, inCart } = useCart();
    const [showRemove, setShowRemove] = useState(false);
   
    const handleMouseOver = (e) => {
        setShowRemove(true);
    }

    const handleMouseOut = (e) => {
        setShowRemove(false);
    }

    if(!inCart(_domain.id)) {
        return (
            <> 
            <OverlayTrigger placement="top"  overlay={<Tooltip>Add To Cart </Tooltip>} >
                <button className="btn btn-outline-success btn-sm" 
                    onClick={(e)=> { addItem(_domain);  toast.success("Added from cart"); }}>
                    <Cart4 />
                </button> 
            </OverlayTrigger>
            </>
        )   
    } else {
        return (
            <>
                <button className={showRemove ? "btn btn-sm btn-outline-danger": "btn btn-sm btn-outline-success"}
                    onMouseOverCapture={handleMouseOver} 
                    onMouseOutCapture={handleMouseOut}
                    onClick={(e)=> { removeItem(_domain.id); toast.success("Removed from cart") }}>
                    {showRemove && <span><X /></span>}
                    {!showRemove && <span><Check2 /></span>}
                </button> 
            </>
        )
    }   
}

export default AddToCardSmall;

