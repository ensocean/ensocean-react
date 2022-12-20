import React from "react";
import { useRegisterlist } from "react-use-registerlist";
import { Check2, X, ThreeDotsVertical } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MAX_CART_ITEM_COUNT = Number(process.env.REACT_APP_MAX_CART_ITEM_COUNT);

function ClaimNowButtonSmall({domain}) {  
    var _domain = JSON.parse(JSON.stringify(domain));
    _domain.price = 0;
    Object.preventExtensions(_domain);
     
    const navigate = useNavigate(); 
    const { addItem, totalUniqueItems, inRegisterlist } = useRegisterlist(); 
    

    const addToRegisterlist = () => {
        if(totalUniqueItems >= MAX_CART_ITEM_COUNT)
        {
            toast.error("Exced Max. Item Count");     
            return;
        }
        addItem(_domain); 
        toast.success("Added to cart")
        navigate("/register")
    }

    if(!inRegisterlist(_domain.id)) {
        return (
            <> 
            <button className="btn btn-sm btn-outline-success" 
                onClick={(e)=> { addToRegisterlist(_domain) }}>
                    Claim Now
            </button> 
            </>
        )   
    }   
}

export default ClaimNowButtonSmall;

