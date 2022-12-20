

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
            { 
                 <OverlayTrigger placement="top" overlay={<Tooltip>Add To Favorites</Tooltip>} >
                    <button className="btn btn-default btn-sm" 
                        onClick={(e)=> { addItem(domain);  toast.success("Added to favorites");   }}>
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
                        onClick={(e)=> { removeItem(domain.id);  toast.success("Removed from favorites") }}>
                        {showRemove && <span><X width={20} height={20} /> </span>} 
                        {!showRemove && <span><HeartFill width={20} height={20} /> </span>}
                    </button> 
                </OverlayTrigger>   
            </>
        )
    }   

     
}

export default AddToWatchlistSmallButton;

