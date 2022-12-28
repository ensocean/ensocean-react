

import React, {useState} from "react";
import { useRegisterlist } from "react-use-registerlist";
import { Check2, X } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { getLabelHash, isAvailable, isValidName } from "../helpers/String";

const MAX_CART_ITEM_COUNT = Number(process.env.REACT_APP_MAX_CART_ITEM_COUNT);

function AddToCartButton({domain, label}) {   
    let tempDomain = domain;

    if(domain === undefined || domain === null) { 
        tempDomain = { id: getLabelHash(label), label: label, extension: "eth", price: 0, expires: null, registered: null, owner: null };
    }

    var _domain = JSON.parse(JSON.stringify(tempDomain));
    _domain.price = 0;
    Object.preventExtensions(_domain);

    const { addItem, removeItem, inRegisterlist, totalUniqueItems } = useRegisterlist();
    const [showRemove, setShowRemove] = useState(false);
   
    const handleMouseOver = (e) => {
        setShowRemove(true);
    }

    const handleMouseOut = (e) => {
        setShowRemove(false);
    }

    const addToRegisterlist = () => {
        if(totalUniqueItems >= MAX_CART_ITEM_COUNT)
        {
            toast.error("Exced Max. Item Count");     
            return;
        }
        addItem(_domain);  
        toast.success("Added to cart"); 
    }

    if(!inRegisterlist(_domain.id)) {
        return (
            <> 
            {isValidName(_domain.label) && isAvailable(_domain.expires) && 
                <button className="btn btn-success" 
                    onClick={(e)=> { addToRegisterlist(_domain) }}>
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

