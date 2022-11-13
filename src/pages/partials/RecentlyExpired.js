import moment from 'moment';
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { obscureLabel } from "../../helpers/String";
import TimeAgo from "javascript-time-ago";  
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);
 
const RECENTLY_EXPIRED = gql`
{
  domains (first: 10, orderBy: expires, orderDirection: desc, where: {  
    label_not: null,
    expires_lte: ${moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix()}
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
                    <Link
                      className="text-decoration-none link-dark fs-5 fw-bold" 
                      data-bs-toggle="tooltip" 
                      data-bs-title={"View "+ domain.name +" on EnsOcean"}
                      title={"View "+ domain.name +" on EnsOcean"}
                      to={domain.name}>
                        {obscureLabel(domain.name, 20)}
                    </Link>
                    &nbsp;
                    { (domain.tags.includes("include-unicode") || domain.tags.includes("only-unicode")) && 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle text-warning" viewBox="0 0 16 16">
                            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                        </svg>
                    }
                    <span className="float-end">
                    {timeAgo.format(moment.unix(domain.expires).add(GRACE_PERIOD, "days").add(PREMIUM_PERIOD, "days").toDate())}
                    </span>
                </li>
              ))}
            </>
        )
    } 
}

export default RecentExpired;