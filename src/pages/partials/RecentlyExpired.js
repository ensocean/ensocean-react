import { useQuery, gql } from "@apollo/client";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { getExpireCondition, getExpires, getTokenId, isExpired, isValidName, obscureLabel } from "../../helpers/String";
import spinner from '../../assets/spinner.svg'

const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;

const RECENTLY_EXPIRED = gql`
{
  domains (first: 10, orderBy: expires, orderDirection: desc, where: {  
    label_not: null,
    expires_lte: ${getExpireCondition()}
  } ) {
    id
    label
    name
    hash
    created
    registered
    expires
    owner
    registrant,
    length
    tags
  }
}
`;


const RecentExpired = () => {
    const { data, loading, error } = useQuery(RECENTLY_EXPIRED);
    return (
      <>
        <div className="card">
          <div className="card-header d-flex justify-content-between">
              <h5 className='fs-4'>Just Dropped</h5>
          </div> 
          <ol className="list-group list-group-flush placeholder-glow">
            <GetExpired data={data} loading={loading} error={error} />
          </ol> 
          <div className="card-footer">
              <Link className="btn btn-success" to="/discover?tab=expired" title="View all expired ENS domains">View More</Link>
          </div>
        </div>
      </>
    )
}

const GetExpired = ({ data, loading, error }) => {
    if(loading) {
        return ( 
            <>
                {[...Array(10)].map((x, i) =>
                <li key={i} className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex">
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-2"></span>
                </li>
                )}
            </>     
        )
    } else if (error) {
      return <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-danger'>{error.message}</span></li>
    } else {
        return (
            <>
                {data.domains.length < 1 &&
                  <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-warning'>No Result</span></li>
                }
                {data.domains.map((domain) => (
                <li key={domain.id} className="list-group-item list-group-item-action p-3">

                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className='bg-thumb' style={{width: "46px", height: "46px"}}>
                          <LazyLoadImage
                              alt={domain.name} 
                              className="img-fluid h-100 w-100 border border-2"
                              width={"46px"}
                              height={"46px"}
                              onError={(e)=> { e.target.style.display = "none"; e.target.parentNode.style.display = "none"; }}
                              placeholderSrc={spinner}
                              visibleByDefault={false}
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

                                  { (domain.tags.includes("include-unicode") || domain.tags.includes("only-unicode")) && 
                                      <span data-bs-toogle="tooltip" data-bs-title="Include unicode characters">
                                        &nbsp;
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill text-warning" viewBox="0 0 16 16">
                                              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                          </svg>
                                      </span>
                                  } 
                                  { !isValidName(domain.label) && 
                                      <span data-bs-toogle="tooltip" data-bs-title="This domain is malformed!">
                                          &nbsp;
                                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle-fill text-danger" viewBox="0 0 16 16">
                                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z"/>
                                          </svg>
                                      </span>
                                  } 
                              </Link> 
                              <small className="float-end text-success mt-2 mt-lg-0">
                                  { isExpired(domain.expires) &&
                                    <span className="text-success"> Available since {getExpires(domain.expires, true)} </span>
                                  } 
                              </small>
                          </div>
                      </div>
                    </div> 
                </li>
              ))}
            </>
        )
    } 
}

export default RecentExpired;