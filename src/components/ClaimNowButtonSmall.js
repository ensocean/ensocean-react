import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function ClaimNowButtonSmall({domain}) {   
    const navigate = useNavigate(); 
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
            <button className="btn btn-sm btn-outline-success" 
                onClick={(e)=> { addItem(domain); navigate("/register") }}>
                    Claim Now
            </button> 
        )   
    } else {
        return (
            <button className={showRemove ? "btn btn-sm btn-outline-danger ps-2": "btn btn-sm btn-outline-success ps-2"}
                onMouseOverCapture={handleMouseOver} 
                onMouseOutCapture={handleMouseOut}
                onClick={(e)=> { removeItem(domain.id);  }}>
                {showRemove && <span><X /> Remove From Cart</span>}
                {!showRemove && <span><Check2 /> Added To Cart</span>}
            </button>
        )
    }   
}

export default ClaimNowButtonSmall;

