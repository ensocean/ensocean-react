

import React, {useState} from "react";
import { useCart } from "react-use-cart";
import { Check2, X, Cart4 } from "react-bootstrap-icons";
import {  OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { isAvailable, isValidName } from "../helpers/String";

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

    const addToCart = (d) => {
        if(totalUniqueItems >= MAX_CART_ITEM_COUNT)
        {
            toast.error("Exced Max. Item Count");     
            return;
        }
        addItem(d);  
        toast.success("Added to cart"); 
    }

    if(!inCart(_domain.id)) {
        return (
            <>   
             {isValidName(domain.label) && isAvailable(domain.expires) &&  
                <OverlayTrigger placement="top"  overlay={<Tooltip>Add To Cart </Tooltip>} >
                    <button className="btn btn-default btn-sm" 
                        onClick={(e)=> { addToCart(_domain) }}>
                        <Cart4 width={20} height={20} />
                    </button>  
                </OverlayTrigger>   
            }
            </>
        )   
    } else {
        return (
            <> 
             <OverlayTrigger placement="top"  overlay={<Tooltip>Remove From Cart </Tooltip>} >
                <button className={showRemove ? "btn btn-default btn-sm": "btn btn-default btn-sm text-success"}
                    onMouseOverCapture={handleMouseOver} 
                    onMouseOutCapture={handleMouseOut}
                    onClick={(e)=> { removeItem(_domain.id); toast.success("Removed from cart") }}>
                    {showRemove && <span><X width={20} height={20} /> </span>} 
                    {!showRemove && <span><Check2 width={20} height={20} /> </span>}
                </button> 
            </OverlayTrigger>  
            </>
        )
    }   
}

export default AddToCartSmallButton;

