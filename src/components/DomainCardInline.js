
import AddToCardSmall from './AddToCardSmall';
import ClaimNowButtonSmall from './ClaimNowButtonSmall';
import DomainLink from './DomainLink';
import ImageSmall from './ImageSmall';
   
function DomainCardInline({domain, showBadge = true, showRegistered=false, showNotAvailable=false, showAddToCartButton=false}) { 
    return (
        <div className="d-flex">
            <div className="flex-shrink-0">
                <div className="card text-start">
                    <ImageSmall domain={domain} width={32} height={32} />
                </div>
            </div>
            <div className="flex-grow-1 ms-3 d-flex flex-column gap-2">
                <DomainLink domain={domain} showBadge={showBadge} showRegistered={showRegistered} showNotAvailable={showNotAvailable} showAddToCartButton={showAddToCartButton} />
            </div>
        </div> 
    )
}

export default DomainCardInline;

