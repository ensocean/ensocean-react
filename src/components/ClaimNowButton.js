import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function ClaimNowButton({domain}) {   
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
            <button className="btn btn-outline-success rounded-4" 
                onClick={(e)=> { addItem(domain); navigate("/register") }}>
                    Claim Now
            </button> 
        )   
    } else {
        return (
            <button className={showRemove ? "btn btn-outline-danger rounded-4 ps-2": "btn btn-outline-success rounded-4 ps-2"}
                onMouseOverCapture={handleMouseOver} 
                onMouseOutCapture={handleMouseOut}
                onClick={(e)=> { removeItem(domain.id);  }}>
                {showRemove && <span><X /> Remove From Cart</span>}
                {!showRemove && <span><Check2 /> Added To Cart</span>}
            </button>
        )
    }   
}

export default ClaimNowButton;

