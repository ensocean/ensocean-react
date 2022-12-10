
 import { isAvailable, isExpired } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import ClaimNowButton from './ClaimNowButton';
import DomainLink from './DomainLink';
import ImageSmall from './ImageSmall';
import ViewYourCartButton from './ViewYourCartButton';
import {useCart} from "react-use-cart";
import DomainStatus from './DomainStatus';
   
function DomainCardInline({domain, showBadge = true, showRegistered=false, showNotAvailable=false, showAddToCartButton=false, showExpires=false, imageWidth=32, imageHeight=32}) { 
    const {inCart} = useCart();
    return (
        <div className="d-flex">
            <div className="flex-shrink-0">
                <div className="card text-start">
                    <ImageSmall domain={domain} width={imageWidth} height={imageHeight} />
                </div>
            </div>
            <div className="flex-grow-1 d-flex flex-column flex-md-row justify-content-between gap-2 ms-3 text-truncate">
                <DomainLink domain={domain} />
                <DomainStatus loading={false} domain={domain} showBadge={showBadge} showRegistered={showRegistered} showAddToCartButton={showAddToCartButton} showNotAvailable={showNotAvailable} showExpires={showExpires} />
            </div>
        </div>
    )
}

export default DomainCardInline;

