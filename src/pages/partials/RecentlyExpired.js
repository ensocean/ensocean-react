import React from "react"; 
import { useLazyQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { getExpireCondition } from "../../helpers/String";
import arrowRepeatSpinIcon from '../../assets/arrow-repeat-spin.svg' 
import refreshIcon from "../../assets/arrow-repeat.svg";
import DomainCardInline from "../../components/DomainCardInline";
import DomainLink from "../../components/DomainLink";
import ImageSmall from "../../components/ImageSmall";
import DomainStatus from "../../components/DomainStatus";
import AddToCartSmallButton from "../../components/AddToCartSmallButton";
import AddToCartButton from "../../components/AddToCartButton";
import AddToFavoritesSmallButton from "../../components/AddToFavoritesSmallButton";
  
const RECENTLY_EXPIRED = gql`
{
  domains (first: 10, orderBy: expires, orderDirection: desc, where: {  
    label_not: null,
    expires_lte: ${getExpireCondition()}
  } ) {
    id
    label  
    created
    registered
    expires
    owner
    registrant,
    length
    tags
    extension
  }
}
`;


const RecentExpired = () => {

    const [getExpired, { called, loading, error, data, refetch }] = useLazyQuery(RECENTLY_EXPIRED, { 
        notifyOnNetworkStatusChange: true
    });
 
    if(!called) getExpired();
  
    const handleRefresh = (e) => {
      refetch();
    }

    return (
      <>
        <div className="card">
          <div className="card-header d-flex justify-content-between">
              <h5 className='fs-4 m-1'>Just Dropped</h5>
              <button className={loading ? "btn btn-outline-light disabled": "btn btn-outline-light"}>
              {loading &&
                <img src={arrowRepeatSpinIcon} alt="" /> 
              }
              {!loading &&
                <img src={refreshIcon} alt="" onClick={handleRefresh} /> 
              }
              </button>
          </div> 
          <ol className="list-group list-group-flush placeholder-glow">

            { loading && 
              <>
                  {[...Array(10)].map((x, i) =>
                  <li key={i} className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex">
                      <span className="placeholder col-4"></span>
                      <span className="placeholder col-2"></span>
                  </li>
                  )}
              </>     
            }

            { !loading && error && 
                <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-danger'>{error.message}</span></li>
            }

            { !loading && !error && data && data.domains.length < 1 &&
                <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-warning'>No Result</span></li>
            }

            { !loading && !error && data && data.domains.length > 0 &&
              <> 
                  {data.domains.map((domain) => (
                  <li key={domain.id} className="list-group-item list-group-item-action p-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                            <div className="card">
                                <ImageSmall domain={domain} width={48} height={48} />
                            </div>
                        </div>
                        <div className="flex-grow-1 d-flex flex-column justify-content-between ms-2 text-truncate flex-fill">
                          <div className="d-flex flex-row justify-content-between">
                            <DomainLink domain={domain} /> 
                            <div className="d-flex flex-row gap-1">
                              <AddToCartSmallButton domain={domain} /> 
                              <AddToFavoritesSmallButton domain={domain} /> 
                            </div>
                          </div> 
                          <div className="d-flex flex-row justify-content-start">
                              <DomainStatus loading={loading} domain={domain} showBadge={true}  showAddToCartButton={true} />
                          </div>  
                        </div>
                      </div>  
                  </li>
                ))}
              </>
            }

          </ol> 
          <div className="card-footer">
              <Link className="btn btn-success" to="/discover?tab=expired" title="View all expired ENS domains">View More</Link>
          </div>
        </div>
      </>
    )
}
 
export default RecentExpired;