

import React, {useState, useEffect} from "react";
import { useCart, CartProvider, createCartIdentifier } from "react-use-cart";
import { Check2, X, Cart4, Heart, ThreeDotsVertical, HeartFill } from "react-bootstrap-icons";
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { isAvailable, isValidName } from "../helpers/String";
 
function AddToFavoritesSmallButton({domain}) {   
      
    var _domain = JSON.parse(JSON.stringify(domain));
    _domain.price = 0;
    Object.preventExtensions(_domain);
   
    const { addItem, removeItem, inCart, totalUniqueItems, id, metadata, clearCartMetadata } = useCart();
    const [showRemove, setShowRemove] = useState(false);
    
    console.log(id);

    const handleMouseOver = (e) => {
        setShowRemove(true);
    }

    const handleMouseOut = (e) => {
        setShowRemove(false);
    }

    const addToFavorites = () => { 
        addItem(_domain);  
        toast.success("Added to favorites"); 
    }

    if(!inCart(_domain.id)) {
        return (
            <>   
            { 
                 <OverlayTrigger placement="top"  overlay={<Tooltip>Add To Favorites </Tooltip>} >
                    <button className="btn btn-default btn-sm" 
                        onClick={(e)=> { addToFavorites(_domain); }}>
                        <Heart width={20} height={20} />
                    </button>  
                </OverlayTrigger> }
            </>
        )  
    } else {
        return (
            <> 
                <OverlayTrigger placement="top"  overlay={<Tooltip>Remove From Favorites </Tooltip>} >
                    <button className={showRemove ? "btn btn-sm btn-default": "btn btn-sm btn-default text-danger"}
                        onMouseOverCapture={handleMouseOver} 
                        onMouseOutCapture={handleMouseOut}
                        onClick={(e)=> { removeItem(_domain.id);  toast.success("Removed from favorites") }}>
                        {showRemove && <span><X width={20} height={20} /> </span>} 
                        {!showRemove && <span><HeartFill width={20} height={20} /> </span>}
                    </button> 
                </OverlayTrigger>   
            </>
        )
    }   

     
}

export default AddToFavoritesSmallButton;

