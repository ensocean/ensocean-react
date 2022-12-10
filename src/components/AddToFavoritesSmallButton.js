

import React, {useState, useEffect} from "react";
import { useCart } from "react-use-cart";
import { Check2, X, Cart4, Heart, ThreeDotsVertical } from "react-bootstrap-icons";
import { Dropdown, DropdownButton, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { isAvailable, isValidName } from "../helpers/String";
 
function AddToFavoritesSmallButton({domain}) {   
      
    return (
        <>   
            { <OverlayTrigger placement="top"  overlay={<Tooltip>Add To Favorites </Tooltip>} >
                <button className="btn btn-outline-danger btn-sm" 
                    onClick={(e)=> {  }}>
                    <Heart />
                </button>  
            </OverlayTrigger>}
        </>
    )   
}

export default AddToFavoritesSmallButton;

