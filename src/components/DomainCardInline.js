
 import { isAvailable, isExpired } from '../helpers/String';
import AddToCartButton from './AddToCartButton';
import ClaimNowButton from './ClaimNowButton';
import DomainLink from './DomainLink';
import ImageSmall from './ImageSmall';
import ViewYourCartButton from './ViewYourCartButton';
import {useCart} from "react-use-cart";
   
function DomainCardInline({domain, showBadge = true, showRegistered=false, showNotAvailable=false, showAddToCartButton=false, imageWidth=32, imageHeight=32}) { 
    const {inCart} = useCart();
    return (
        <div className="d-flex">
            <div className="flex-shrink-0">
                <div className="card text-start">
                    <ImageSmall domain={domain} width={imageWidth} height={imageHeight} />
                </div>
            </div>
            <div className="flex-grow-1 ms-3 d-flex flex-column gap-2">
                <DomainLink domain={domain} showBadge={showBadge} showRegistered={showRegistered} showNotAvailable={showNotAvailable} showAddToCartButton={showAddToCartButton} />
                {!showAddToCartButton && isAvailable(domain.expires) && 
                    <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-3"> 
                        <AddToCartButton domain={domain} />
                        {!inCart(domain.id) && <ClaimNowButton domain={domain} />}
                        {inCart(domain.id) && <ViewYourCartButton domain={domain} />}
                    </div> 
                  }
            </div>
        </div> 
    )
}

export default DomainCardInline;

