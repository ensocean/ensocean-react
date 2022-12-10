

import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { isAvailable, isValidName } from "../helpers/String";

const MAX_CART_ITEM_COUNT = Number(process.env.REACT_APP_MAX_CART_ITEM_COUNT);

function AddToCartButton({domain}) {   
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
            {isValidName(domain.label) && isAvailable(domain.expires) && 
                <button className="btn btn-success" 
                    onClick={(e)=> { addToCart(_domain) }}>
                        Add To Cart
                </button> 
            }
            </>
        )   
    } else {
        return (
            <button className={showRemove ? "btn btn-danger": "btn btn-success"}
                onMouseOverCapture={handleMouseOver} 
                onMouseOutCapture={handleMouseOut}
                onClick={(e)=> { removeItem(_domain.id);  }}>
                {showRemove && <span><X /> Remove From Cart</span>}
                {!showRemove && <span><Check2 /> Added To Cart</span>}
            </button>
        )
    }   
}

export default AddToCartButton;

