

import React, {useState} from "react";
import { useWatchlist } from "react-use-watchlist";
import { X, Heart, HeartFill } from "react-bootstrap-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify"; 
 
function AddToWatchlistSmallButton({domain}) {   
       
    const { addItem, removeItem, inWatchlist } = useWatchlist();
    const [showRemove, setShowRemove] = useState(false);
     
    const handleMouseOver = (e) => {
        setShowRemove(true);
    }

    const handleMouseOut = (e) => {
        setShowRemove(false);
    }
  
    if(!inWatchlist(domain.id)) {
        return (
            <>   
                <button className={ "btn btn-sm btn-default"} 
                    onClick={(e)=> { addItem(domain);  toast.success("Added to favorites");   }}>
                    <Heart width={20} height={20} />
                </button>  
            </>
        )  
    } else {
        return (
            <> 
                <button className={ "btn btn-sm btn-default text-danger" } 
                    onClick={(e)=> { removeItem(domain.id);  toast.success("Removed from favorites") }}>
                    {showRemove && <span><X width={20} height={20} /> </span>} 
                    {!showRemove && <span><HeartFill width={20} height={20} /> </span>}
                </button> 
            </>
        )
    }   

     
}

export default AddToWatchlistSmallButton;

