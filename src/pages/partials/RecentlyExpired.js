import React from "react"; 
import { useLazyQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { getExpireCondition } from "../../helpers/String"; 
import DomainLink from "../../components/DomainLink";
import ImageSmall from "../../components/ImageSmall";
import DomainStatus from "../../components/DomainStatus";
import AddToCartSmallButton from "../../components/AddToCartSmallButton"; 
import AddToWatchlistSmallButton from "../../components/AddToWatchlistSmallButton"; 
import { Spinner } from "react-bootstrap";
import { ArrowRepeat } from "react-bootstrap-icons";
  
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
    owner {
      id
    }
    registrant {
      id
    }
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
              <button onClick={handleRefresh} disabled={loading?"disabled": ""} className={"btn btn-outline-light text-dark"}>
                {loading &&
                    <Spinner animation="border" variant="dark" size="sm" />
                }
                {!loading &&
                    <ArrowRepeat />
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
                          <div className="d-flex flex-row justify-content-between gap-2">
                            <DomainLink domain={domain} /> 
                            <div className="d-flex flex-row gap-2">  
                                <AddToCartSmallButton domain={domain} />   
                                <AddToWatchlistSmallButton domain={{ id: domain.id, price: 0 }} /> 
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
              <Link className="btn btn-primary" to="/expired" title="View all expired ENS domains">View More</Link>
          </div>
        </div>
      </>
    )
}
 
export default RecentExpired;