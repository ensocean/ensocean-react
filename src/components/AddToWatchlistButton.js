

import React from "react";
import { useWatchlist } from "react-use-watchlist";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";  
import { getLabelHash } from "../helpers/String";
 
function AddToWatchlistButton({domain, label}) {   
         
    let tempDomain = domain;

    if(domain === undefined || domain === null) { 
        tempDomain = { id: getLabelHash(label), label: label, extension: "eth", price: 0, expires: null, registered: null, owner: null };
    }

    var _domain = JSON.parse(JSON.stringify(tempDomain));
    _domain.price = 0;
    Object.preventExtensions(_domain);

    const { addItem, removeItem, inWatchlist } = useWatchlist();
      
    const handleAdd = (e) => {
        addItem(_domain);  
        toast.success("Added to favorites");
    }

    const handleRemove = (e) => {
        e.preventDefault(); 
        removeItem(_domain.id);  
        toast.success("Removed from favorites");
    }

   
    if(!inWatchlist(_domain?.id)) {
        return (
            <>   
                <button className={ "btn btn-default text-white p-0"} 
                    onClick={handleAdd}>
                    <Heart width={24} height={24} />
                </button>  
            </>
        )  
    } else {
        return (
            <> 
                <button className={ "btn btn-default text-danger p-0" } 
                    onClick={handleRemove}>
                    <HeartFill width={24} height={24} />
                </button> 
            </>
        )
    }   

     
}

export default AddToWatchlistButton;

