

import React from "react";
import { useRegisterlist } from "react-use-registerlist";
import { CartFill, Cart } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { isAvailable, isValidName } from "../helpers/String";

const MAX_CART_ITEM_COUNT = Number(process.env.REACT_APP_MAX_CART_ITEM_COUNT);

function AddToCartSmallButton({domain}) {   
    
    var _domain = JSON.parse(JSON.stringify(domain));
    _domain.price = 0;
    Object.preventExtensions(_domain);
 
    const { addItem, removeItem, inRegisterlist, totalUniqueItems } = useRegisterlist();
    

    const addToRegisterlist = (d) => {
        if(totalUniqueItems >= MAX_CART_ITEM_COUNT)
        {
            toast.error("Exced Max. Item Count");     
            return;
        }
        addItem(d);  
        toast.success("Added to cart"); 
    }

    if(!inRegisterlist(_domain.id)) {
        return (
            <>   
             {isValidName(domain.label) && isAvailable(domain.expires) &&  
                    <button className="btn btn-default btn-sm p-0" 
                        onClick={(e)=> { addToRegisterlist(_domain) }}>
                        <Cart width={20} height={20} />
                    </button>  
            }
            </>
        )   
    } else {
        return (
            <> 
                <button className={"btn btn-default btn-sm text-success p-0"}
                    onClick={(e)=> { removeItem(_domain.id); toast.success("Removed from cart") }}>
                    {<span><CartFill width={20} height={20} /> </span>}
                </button> 
            </>
        )
    }   
}

export default AddToCartSmallButton;

