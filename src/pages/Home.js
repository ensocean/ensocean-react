import Carousel from "./partials/Carousel";
import CustomConnectButton from "./partials/ConnectButton";
import Moment from 'react-moment';
import moment from 'moment';
import { useQuery, gql } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { obscureString } from "../helpers/String";
 
TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo();

const RECENTLY_EXPIRED = gql`
  {
    domains (first: 12, order: expired, orderDirection: desc, where: {  
      label_not: null,
      expires_lte: ${moment().add(-Number(process.env.REACT_APP_GRACE_PERIOD), "days").add(-Number(process.env.REACT_APP_PREMIUM_PERIOD), "days").utc().unix()}
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

const RECENTLY_REGISTERED = gql`
  {
    domains (first: 12, order: registered, orderDirection: desc, where: {  
      label_not: null,
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

const Home = () => { 
  return (
      <> 
        <Carousel />
        <div className="container">
          <div className="row">
            <RecentExpired />
            <RecentRegistered />
          </div>
        </div>
      </>
  );
};

const RecentExpired = () => {
  const { data, loading, error } = useQuery(RECENTLY_EXPIRED);
  
  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>
   
  return (
    <>
    <div className="col-6">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
            <h5>Just Dropped</h5>
        </div> 
        <ol className="list-group list-group-numbered">
        {data.domains.map((domain) => (
          <li key={domain.id} className="list-group-item">
                <Link
                className="text-decoration-none" 
                data-bs-toggle="tooltip" 
                data-bs-title={"View "+ domain.name +" on EnsOcean"}
                title={"View "+ domain.name +" on EnsOcean"}
                to={domain.name}>
                  {obscureString(domain.name, 20)}
              </Link>
              <span className="float-end">
              {timeAgo.format(moment.unix(domain.expires).toDate())}
              </span>
          </li>
        ))} 
        </ol> 
        <div className="card-footer">
            <Link className="btn btn-success" to="/discover?tab=expired" title="View all expired ENS domains">View More</Link>
        </div>
      </div>
    </div>
    </>
  )
}

const RecentRegistered = () => {
  const { data, loading, error } = useQuery(RECENTLY_REGISTERED);
  
  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>
   
  return (
    <>
    <div className="col-6">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
            <h5>Recently Registered</h5>
        </div> 
        <ol className="list-group list-group-numbered">
        {data.domains.map((domain) => (
          <li key={domain.id} className="list-group-item">
                <Link
                className="text-decoration-none" 
                data-bs-toggle="tooltip" 
                data-bs-title={"View "+ domain.name +" on EnsOcean"}
                title={"View "+ domain.name +" on EnsOcean"}
                to={domain.name}>
                  {obscureString(domain.name, 20)}
              </Link>
              <span className="float-end">
              {timeAgo.format(moment.unix(domain.registered).toDate())}
              </span>
          </li>
        ))} 
        </ol> 
        <div className="card-footer">
            <Link className="btn btn-success" to="/discover?tab=registered" title="View all expired ENS domains">View More</Link>
        </div>
      </div>
      </div>
    </>
  )
}


export default Home;