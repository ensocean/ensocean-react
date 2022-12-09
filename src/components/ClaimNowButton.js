import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MAX_CART_ITEM_COUNT = Number(process.env.REACT_APP_MAX_CART_ITEM_COUNT);

function ClaimNowButton({loading, domain}) {   
    var _domain = JSON.parse(JSON.stringify(domain));
    _domain.price = 0;
    Object.preventExtensions(_domain);

    const navigate = useNavigate(); 
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
        toast.success("Added to cart")
        navigate("/register")
    }

    if(!inCart(_domain.id)) {
        return ( 
            <> 
            <button disabled={loading ? "disabled": ""} className="btn btn-outline-success rounded-4" 
                onClick={(e)=> { addToCart(_domain) }}>
                    Claim Now
            </button> 
            </>
        )   
    } else {
        return (
            <button disabled={loading ? "disabled": ""} className={showRemove ? "btn btn-outline-danger rounded-4 ps-2": "btn btn-outline-success rounded-4 ps-2"}
                onMouseOverCapture={handleMouseOver} 
                onMouseOutCapture={handleMouseOut}
                onClick={(e)=> { removeItem(_domain.id);  }}>
                {showRemove && <span><X /> Remove From Cart</span>}
                {!showRemove && <span><Check2 /> Added To Cart</span>}
            </button>
        )
    }   
}

export default ClaimNowButton;

