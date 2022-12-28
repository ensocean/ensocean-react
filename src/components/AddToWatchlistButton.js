

import React from "react";
import { useWatchlist } from "react-use-watchlist";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";  
 
function AddToWatchlistButton({domain}) {   
        
    const { addItem, removeItem, inWatchlist } = useWatchlist();
      
    const handleAdd = (e) => {
        addItem(domain);  
        toast.success("Added to favorites");
    }

    const handleRemove = (e) => {
        e.preventDefault(); 
        removeItem(domain.id);  
        toast.success("Removed from favorites");
    }

   
    if(!inWatchlist(domain.id)) {
        return (
            <>   
                <button className={ "btn btn-default text-white p-0"} 
                    onClick={handleAdd}>
                    <Heart width={32} height={32} />
                </button>  
            </>
        )  
    } else {
        return (
            <> 
                <button className={ "btn btn-default text-danger p-0" } 
                    onClick={handleRemove}>
                    <HeartFill width={32} height={32} />
                </button> 
            </>
        )
    }   

     
}

export default AddToWatchlistButton;

