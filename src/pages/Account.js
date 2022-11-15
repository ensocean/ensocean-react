import {Helmet} from "react-helmet";
import { useParams } from "react-router-dom";
import { obscureAddress } from "../helpers/String";
import Filter from "./partials/Filter";

const Account = () => {
    const { address } = useParams();  
    let where = { label_not: null, owner: address }; 
    return (
      <>
      <Helmet> 
          <title>{address} - EnsOcean</title>
          <meta name="description" content="" />
      </Helmet>
      <div className="container-fluid bg-primary">
          <div className="container text-center p-3 text-white">
              <h1>{obscureAddress(address)}</h1>
          </div> 
      </div>
      <div className="container-fluid p-0 m-0">
            <div className="card text-center">
                <div className="card-body">
                <Filter First={100} Skip={0} OrderBy={"created"} OrderDirection={"desc"} Where={where} />
                </div>
            </div>
        </div>  
      </> 
    );
};
  
export default Account;