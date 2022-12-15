import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
import moment from "moment";
 
const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

const Expired = () => {  
    return (
        <>
        <Helmet> 
            <title>Dropped ENS Web3 Domains - EnsOcean</title>
            <meta name="description" content="View all expired ENS domains. Catch and claim again for yourself easily." />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>Recently Expired</h1>
            </div> 
        </div>
        <div className="container-fluid p-0 m-0">
            <div className="card text-center">
                <div className="card-header border-0">
                     <Tabs tab="expired" />
                </div>
                <div className="card-body ps-3 pe-3">
                    <Filter First={100} Skip={0} Tab={"expired"} OrderBy={"expires"} OrderDirection={"desc"} Where={{
                           label_not: null,
                           expires_lte: moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix() 
                    }} View="gallery" />
                </div>
            </div>
        </div> 
        </>
    ) 
};

 
  
export default Expired;