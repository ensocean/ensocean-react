import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";  
import refreshIcon from "../../assets/arrow-repeat.svg";
import arrowRepeatSpinIcon from '../../assets/arrow-repeat-spin.svg'
import DomainLink from "../../components/DomainLink";
import ImageSmall from "../../components/ImageSmall"; 
import DomainCardInline from "../../components/DomainCardInline";
 
const RECENTLY_REGISTERED = gql`
{
  domains (first: 10, orderBy: registered, orderDirection: desc, where: {  
    label_not: null, registered_not: null
  } ) {
    id
    label 
    created
    registered
    expires
    owner
    registrant
    length
    tags
    extension
  }
}
`;

const RecentRegistered = () => {
    const [getRegistered, { called, loading, error, data, refetch}] = useLazyQuery(RECENTLY_REGISTERED, {
        notifyOnNetworkStatusChange: true
    });
    
    if(!called) getRegistered();

    const handleRefresh = (e) => {
        refetch();
    }

    return (
      <>
        <div className="card">
          <div className="card-header d-flex justify-content-between">
              <h5 className='fs-4 m-1'>Recently Registered</h5>
              <button className={loading ? "btn btn-outline-light disabled": "btn btn-outline-light"}>
                {loading &&
                    <img src={arrowRepeatSpinIcon} alt="" /> 
                }
                {!loading &&
                    <img src={refreshIcon} alt="" onClick={handleRefresh} /> 
                }
              </button>
          </div> 
          <ol className="list-group list-group-flush">

            { loading &&
            <>
                {[...Array(10)].map((x, i) =>
                <li key={i} className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex">
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-2"></span>
                </li>
                )}
            </>}

            { !loading && error &&
                <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-danger'>{error.message}</span></li>
            }

            { !loading && !error && data && data.domains.length < 1 &&
                <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex text-warning">No Result</li>
            }

            { !loading && !error && data && data.domains.length > 0 &&
                <> 
                {data.domains.map((domain) => (
                    <li key={domain.id} className="list-group-item list-group-item-action p-3">
                        <DomainCardInline domain={domain}  showBadge={false} showRegistered={true} />
                    </li>
                ))}
                </>
            } 
          </ol> 
          <div className="card-footer">
              <Link className="btn btn-success" to="/discover?tab=registered" title="View all expired ENS domains">View More</Link>
          </div>
        </div>
      </>
    )
}
 
export default RecentRegistered;