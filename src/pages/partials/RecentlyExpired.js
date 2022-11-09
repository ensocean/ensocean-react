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
                <li key={domain.id} className="list-group-item p-3 fs-5">
                      <Link
                      className="text-decoration-none" 
                      data-bs-toggle="tooltip" 
                      data-bs-title={"View "+ domain.name +" on EnsOcean"}
                      title={"View "+ domain.name +" on EnsOcean"}
                      to={domain.name}>
                        {obscureLabel(domain.name, 20)}
                    </Link>
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