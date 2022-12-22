
import DomainLink from './DomainLink';
import ImageSmall from './ImageSmall'; 
import DomainStatus from './DomainStatus';
import AddToWatchlistSmallButton from './AddToWatchlistSmallButton';
import AddToCartSmallButton from './AddToCartSmallButton';
import OwnerLink from './OwnerLink';
import OwnerLinkLabel from './OwnerLinkLabel';
import { getExpires, getTimeAgo, isAvailable, isExpired, isExpiring, isValidName } from '../helpers/String';
   
function DomainCardInline({domain, loading = false, showExpires = false}) { 
    if(loading) {
        return (
            <>
                {[...Array(12)].map((x, i) =>
                   <div className="row border-bottom border-light pb-2 placeholder-glow" key={i}> 
                    <div className="col-12 col-sm-12 col-md-6 p-2"> 
                        <div className='d-flex flex-row gap-2 align-items-center'>
                            <div className="flex-shrink-0">
                                <div className="card">
                                    <div className="placeholder card-img-top card-img-bottom" style={{ width:48,  height: 48 }}></div>
                                </div>
                            </div>
                            <div className='flex-grow-1 d-flex flex-column text-truncate gap-1'>
                                <span className='placeholder w-100'></span>
                                <span className='placeholder w-50'></span>
                            </div>  
                        </div>
                    </div> 
                    <div className='col-2 p-2 d-none d-md-block'>
                        <span className='placeholder w-50'></span>
                    </div>
                    <div className='col-2 p-2 d-none d-md-block'>
                        <span className='placeholder w-50'></span>
                    </div>
                    <div className='col-2 p-2 d-none d-md-block'>
                        <span className='placeholder w-50'></span>
                    </div>
                </div> 
                )}
            </>  
        )
    } else {
        return (
            <div className="row border-bottom border-light pb-2"> 
                <div className="col-12 col-sm-12 col-md-6 p-2"> 
                    <div className='d-flex flex-row gap-2'>
                        <div className="flex-shrink-0">
                            <div className="card">
                                <ImageSmall domain={domain} width={48} height={48} />
                            </div>
                        </div>
                        <div className='flex-grow-1 d-flex flex-column text-truncate'>
                            <div className='d-flex flex-row justify-content-between'>
                                <DomainLink domain={domain} />
                                <div className='d-flex flex-row justify-content-end me-2 gap-3'>
                                    <AddToCartSmallButton domain={domain} /> 
                                    <AddToWatchlistSmallButton domain={domain} /> 
                                </div>
                            </div>
                            <DomainStatus domain={domain} showExpires={true} />
                        </div>
                    </div> 
                </div> 
                <div className='col-2 p-2 d-none d-md-block text-truncate'><OwnerLinkLabel owner={domain.owner} /></div>
                <div className='col-2 p-2 d-none d-md-block text-truncate'>{getTimeAgo(domain.registered)}</div>
                <div className='col-2 p-2 d-none d-md-block text-truncate'>{getTimeAgo(domain.created)}</div>
            </div> 
        )
    }
}

export default DomainCardInline;

