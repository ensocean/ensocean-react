

import React, {useState} from "react";
import { useWatchlist } from "react-use-watchlist";
import { X, Heart, HeartFill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify"; 
import { useLocation } from "react-router-dom";
 
function AddToWatchlistSmallButton({domain, parentElem}) {   
       
    let location = useLocation(); 
    const { addItem, removeItem, inWatchlist } = useWatchlist();
      
    const handleAdd = (e) => {
        addItem(domain);  
        toast.success("Added to favorites");
    }

    const handleRemove = (e) => {
        e.preventDefault();
        if(isInWatchlist()) 
            parentElem.current.remove();
        removeItem(domain.id);  
        toast.success("Removed from favorites");
    }

    const isInWatchlist = () => {
        return new URLSearchParams(location.search).get("tab") == "watchlist";
    }

    if(!inWatchlist(domain.id)) {
        return (
            <>   
                <button className={ "btn btn-sm btn-default p-0"} 
                    onClick={handleAdd}>
                    <Heart width={20} height={20} />
                </button>  
            </>
        )  
    } else {
        return (
            <> 
                <button className={ "btn btn-sm btn-default text-danger p-0" } 
                    onClick={handleRemove}>
                    <HeartFill width={20} height={20} />
                </button> 
            </>
        )
    }   

     
}

export default AddToWatchlistSmallButton;

