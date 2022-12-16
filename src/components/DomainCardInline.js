
import DomainLink from './DomainLink';
import ImageSmall from './ImageSmall'; 
import DomainStatus from './DomainStatus';
import AddToWatchlistSmallButton from './AddToWatchlistSmallButton';
import AddToCartSmallButton from './AddToCartSmallButton';
   
function DomainCardInline({domain}) { 

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
                    <AddToWatchlistSmallButton domain={{ id: domain.id, price: 0 }} />  
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

