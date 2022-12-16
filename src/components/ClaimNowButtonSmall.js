import React from "react";
import { useCart } from "react-use-cart";
import { Check2, X, ThreeDotsVertical } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MAX_CART_ITEM_COUNT = Number(process.env.REACT_APP_MAX_CART_ITEM_COUNT);

function ClaimNowButtonSmall({domain}) {  
    var _domain = JSON.parse(JSON.stringify(domain));
    _domain.price = 0;
    Object.preventExtensions(_domain);
     
    const navigate = useNavigate(); 
    const { addItem, totalUniqueItems, inCart } = useCart(); 
    

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
            <button className="btn btn-sm btn-outline-success" 
                onClick={(e)=> { addToCart(_domain) }}>
                    Claim Now
            </button> 
            </>
        )   
    }   
}

export default ClaimNowButtonSmall;

