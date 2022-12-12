
 import { isAvailable, isExpired } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import ClaimNowButton from './ClaimNowButton';
import DomainLink from './DomainLink';
import ImageSmall from './ImageSmall';
import ViewYourCartButton from './ViewYourCartButton';
import {CartProvider, useCart} from "react-use-cart";
import DomainStatus from './DomainStatus';
import AddToFavoritesSmallButton from './AddToFavoritesSmallButton';
import AddToCartSmallButton from './AddToCartSmallButton';
   
function DomainCardInline({domain, showBadge = true, showRegistered=false, showNotAvailable=false, showAddToCartButton=false, showExpires=false, imageWidth=32, imageHeight=32}) { 
    const {inCart} = useCart();
    return (
        <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
                <div className="card">
                    <ImageSmall domain={domain} width={48} height={48} />
                </div>
            </div>
            <div className="flex-grow-1 d-flex flex-column justify-content-between ms-2 text-truncate flex-fill">
                <div className="d-flex flex-row justify-content-between gap-2">
                <DomainLink domain={domain} /> 
                <div className="d-flex flex-row gap-2">
                    <AddToCartSmallButton domain={domain} /> 
                    <CartProvider id="ensocean_favorites" key="ensocean_favorites">
                    <AddToFavoritesSmallButton domain={domain} /> 
                    </CartProvider>
                </div>
                </div> 
                <div className="d-flex flex-row justify-content-start">
                    <DomainStatus domain={domain}  />
                </div>  
            </div>
            </div> 
    )
}

export default DomainCardInline;

