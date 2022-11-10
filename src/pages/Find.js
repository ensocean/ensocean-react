import React  from "react";
import {   useLocation } from "react-router-dom";
import {Helmet} from "react-helmet";

const Find = () => { 
    const query = new URLSearchParams(useLocation().search);
    const label = query.get("label");

    return (
        <>  
        <Helmet> 
              <title>Find Your Web3 Name - EnsOcean</title>
              <meta name="description" content="Find your next Ethereum Name Service (ENS) domain rapidly" />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>Find Your Web3 Name</h1>
            </div> 
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
                 {label}
             </div>
          </div>
        </div>
      </>
    );
};
  
export default Find;