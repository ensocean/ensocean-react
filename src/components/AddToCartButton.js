

import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
  
function AddToCartButton({domain}) {   
    const { addItem, removeItem, inCart } = useCart();
   
    const handleMouseOver = (e) => {
        e.target.innerText = "Remove From Cart";
        e.target.classList.remove("btn-ok"); 
        e.target.classList.add("btn-x");
        e.target.classList.add("btn-danger");
    }

    const handleMouseOut = (e) => {
        e.target.innerText = "Added To Cart";
        e.target.classList.remove("btn-x");
        e.target.classList.add("btn-ok");
        e.target.classList.remove("btn-danger")
    }

    if(!inCart(domain.id)) {
        return (
            <button className="btn btn-success" 
                onClick={(e)=> { addItem(domain); }}>
                    Add To Cart
            </button> 
        )   
    } else {
        return (
            <button className="btn btn-success ps-4 btn-ok" 
                onMouseOverCapture={handleMouseOver} 
                onMouseOutCapture={handleMouseOut}
                onClick={(e)=> { removeItem(domain.id);  }}>
                Added To Cart
            </button>
        )
    }   
}

export default AddToCartButton;

