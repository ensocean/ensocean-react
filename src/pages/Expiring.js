import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet";  
import Tabs from "./partials/Tabs";
import moment from "moment";
 
const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

const Expiring = () => {  
    return (
        <>
        <Helmet> 
            <title>About To Expire Web3 Domains - EnsOcean</title>
            <meta name="description" content="View all expiring ENS domains. Add them to your favorites and claim it for yourself in the future." />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>Expiring Soon</h1>
            </div> 
        </div>
        <div className="container-fluid p-0 m-0">
            <div className="card text-center">
                <div className="card-header border-0">
                     <Tabs tab="expiring" />
                </div>
                <div className="card-body p-2">
                    <Filter First={100} Skip={0} Tab={"expiring"} OrderBy={"expires"} OrderDirection={"asc"} Where={{
                           label_not: null,
                           expires_lte: moment().utc().unix(),
                           expires_gte: moment().add(-PREMIUM_PERIOD, "days").utc().unix()
                    }} View="gallery" />
                </div>
            </div>
        </div> 
        </>
    ) 
};

 
  
export default Expiring;