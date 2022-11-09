import moment from 'moment';
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom"; 
import { obscureLabel } from '../../helpers/String';
import TimeAgo from "javascript-time-ago"; 
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo();
 
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
    registrant,
    length
    tags
  }
}
`;

const RecentRegistered = () => {
    const { data, loading, error } = useQuery(RECENTLY_REGISTERED);
    
    return (
      <>
        <div className="card">
          <div className="card-header d-flex justify-content-between">
              <h5 className='fs-4'>Recently Registered</h5>
          </div> 
          <ol className="list-group list-group-flush">
            <GetRegistered data={data} loading={loading} error={error} />
          </ol> 
          <div className="card-footer">
              <Link className="btn btn-success" to="/discover?tab=registered" title="View all expired ENS domains">View More</Link>
          </div>
        </div>
      </>
    )
}

const GetRegistered = ({data, loading, error }) => {
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
                  <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex text-warning">No Result</li>
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
                        <small className="float-end text-default">
                        {timeAgo.format(moment.unix(domain.registered).toDate())}
                        </small>
                    </li>
                ))} 
            </>
        )
    } 
}

export default RecentRegistered;