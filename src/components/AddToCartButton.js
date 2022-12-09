

import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X } from "react-bootstrap-icons";

function AddToCartButton({domain}) {   
    const { addItem, removeItem, inCart } = useCart();
    const [showRemove, setShowRemove] = useState(false);
   
    const handleMouseOver = (e) => {
        setShowRemove(true);
    }

    const handleMouseOut = (e) => {
        setShowRemove(false);
    }

    if(!inCart(domain.id)) {
        return (
            <button className="btn btn-success rounded-4" 
                onClick={(e)=> { addItem(domain); }}>
                    Add To Cart
            </button> 
        )   
    } else {
        return (
            <button className={showRemove ? "btn btn-danger rounded-4": "btn btn-success rounded-4"}
                onMouseOverCapture={handleMouseOver} 
                onMouseOutCapture={handleMouseOut}
                onClick={(e)=> { removeItem(domain.id);  }}>
                {showRemove && <span><X /> Remove From Cart</span>}
                {!showRemove && <span><Check2 /> Added To Cart</span>}
            </button>
        )
    }   
}

export default AddToCartButton;

