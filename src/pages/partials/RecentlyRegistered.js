import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom"; 
import { getTimeAgo, isValidName, obscureLabel, getTokenId } from '../../helpers/String';
import { LazyLoadImage } from "react-lazy-load-image-component";
import spinner from '../../assets/spinner.svg'
import exclamationTriangleFill from "../../assets/exclamation-triangle-fill.svg";
import dashCircleFill from "../../assets/dash-circle-fill.svg";
import notAvailable from "../../assets/not-available.svg";
import refreshIcon from "../../assets/arrow-repeat.svg";
import arrowRepeatSpinIcon from '../../assets/arrow-repeat-spin.svg'

const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;
 
const RECENTLY_REGISTERED = gql`
{
  domains (first: 10, orderBy: registered, orderDirection: desc, where: {  
    label_not: null, registered_not: null
  } ) {
    id
    label
    name
    hash
    created
    registered
    expires
    owner
    registrant
    length
    tags
  }
}
`;

const RecentRegistered = () => {
    const [getRegistered, { called, loading, error, data, refetch}] = useLazyQuery(RECENTLY_REGISTERED, {
        variables: {  },
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
                        <div className="d-flex">
                            <div className="flex-shrink-0">
                                <div className="card text-start">
                                    <LazyLoadImage
                                        alt={domain.name} 
                                        className="img-fluid card-img-top card-img-bottom"
                                        onError={(e)=> {e.target.src = notAvailable; }}
                                        placeholder={<img src={spinner} className="img-fluid card-img-top card-img-bottom" alt="" />}
                                        placeholderSrc={spinner}
                                        width={46}
                                        height={46}
                                        src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label)) }
                                        /> 
                                </div>
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <div className="d-flex flex-column flex-md-row justify-content-between">
                                    <Link
                                        className="text-decoration-none link-dark fs-5 fw-bold" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-title={"View "+ domain.name +" on EnsOcean"}
                                        title={"View "+ domain.name +" on EnsOcean"}
                                        to={encodeURIComponent(domain.name)}>

                                        {obscureLabel(domain.label, 20)}.{domain.extension || "eth"}
                                        
                                        { ' ' }

                                        { (domain.tags.includes("include-unicode") || domain.tags.includes("only-unicode")) && 
                                                <span data-bs-toogle="tooltip" data-bs-title="Include unicode characters">
                                                    <img src={exclamationTriangleFill} alt= "" />
                                                </span>
                                            }
                                            &nbsp;
                                            { !isValidName(domain.label) && 
                                                <span data-bs-toogle="tooltip" data-bs-title="This domain is malformed!">
                                                    <img src={dashCircleFill} alt= ""  />
                                                </span>
                                            }
                                    </Link>
                                    <small className="float-end text-muted mt-2 mt-lg-0">
                                        {getTimeAgo(domain.registered)}
                                    </small>
                                </div>
                            </div> 
                        </div> 
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