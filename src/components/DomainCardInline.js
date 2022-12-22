
import DomainLink from './DomainLink';
import ImageSmall from './ImageSmall'; 
import DomainStatus from './DomainStatus';
import AddToWatchlistSmallButton from './AddToWatchlistSmallButton';
import AddToCartSmallButton from './AddToCartSmallButton';
import OwnerLink from './OwnerLink';
import OwnerLinkLabel from './OwnerLinkLabel';
import { getExpires, getTimeAgo, isAvailable, isExpired, isExpiring, isValidName } from '../helpers/String';
   
function DomainCardInline({domain, showExpires = false}) { 

    return (
        <div className="d-flex align-items-center  border-light border-bottom pb-2">
            <div className="flex-shrink-0">
                <div className="card">
                    <ImageSmall domain={domain} width={48} height={48} />
                </div>
            </div>
            <div className="flex-grow-1 d-flex flex-column justify-content-between ms-2 text-truncate flex-fill gap-1">
                <div className="d-flex flex-row justify-content-between gap-2">
                    <DomainLink domain={domain} /> 
                    <div className="d-flex flex-row gap-2"> 
                        <DomainStatus domain={domain} showExpires={true} />
                    </div>
                </div> 
                <div className='d-flex flex-row justify-content-between gap-2'>
                    <div className="d-flex flex-row justify-content-start gap-2">
                        <AddToCartSmallButton domain={domain} variation="default" />  
                        <AddToWatchlistSmallButton domain={{ id: domain.id, price: 0 }}  variation="default" />  
                    </div>  
                    <div className='d-flex flex-row gap-2 justify-content-end'>
                        <small className='text-muted'>
                            {!isAvailable(domain.expires) &&
                            <OwnerLinkLabel owner={domain.owner} />
                            }
                        </small>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default DomainCardInline;

