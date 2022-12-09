

import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X, Cart4, ThreeDotsVertical } from "react-bootstrap-icons";
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";

const MAX_CART_ITEM_COUNT = Number(process.env.REACT_APP_MAX_CART_ITEM_COUNT);

function AddToCartSmallButton({domain}) {   
    
    var _domain = JSON.parse(JSON.stringify(domain));
    _domain.price = 0;
    Object.preventExtensions(_domain);

    const { addItem, removeItem, inCart, totalUniqueItems } = useCart();
    const [showRemove, setShowRemove] = useState(false);
   
    const handleMouseOver = (e) => {
        setShowRemove(true);
    }

    const handleMouseOut = (e) => {
        setShowRemove(false);
    }

    const addToCart = () => {
        if(totalUniqueItems >= MAX_CART_ITEM_COUNT)
        {
            toast.error("Exced Max. Item Count");     
            return;
        }
        addItem(_domain);  
        toast.success("Added to cart"); 
    }

    if(!inCart(_domain.id)) {
        return (
            <>   
                <OverlayTrigger placement="top"  overlay={<Tooltip>Add To Cart </Tooltip>} >
                    <button className="btn btn-outline-success btn-sm" 
                        onClick={(e)=> { addToCart(_domain) }}>
                        <Cart4 />
                    </button>  
                </OverlayTrigger>  
            </>
        )   
    } else {
        return (
            <>
             <OverlayTrigger placement="top"  overlay={<Tooltip>Remove From Cart </Tooltip>} >
                <button className={showRemove ? "btn btn-sm btn-outline-danger d-none d-lg-block": "btn btn-sm btn-success d-none d-lg-block"}
                    onMouseOverCapture={handleMouseOver} 
                    onMouseOutCapture={handleMouseOut}
                    onClick={(e)=> { removeItem(_domain.id); toast.success("Removed from cart") }}>
                    {showRemove && <span><X /> </span>} 
                    {!showRemove && <span><Check2 /> </span>}
                </button> 
            </OverlayTrigger> 
            </>
        )
    }   
}

export default AddToCartSmallButton;

