import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
import moment from "moment";
 
const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

const Premium = () => {  
    return (
        <>
        <Helmet> 
            <title>Premium Web3 Domains - EnsOcean</title>
            <meta name="description" content="View all premium ENS domains. Claim it for yourself with an extra payment." />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>Premium Right Now</h1>
            </div> 
        </div>
        <div className="container-fluid p-0 m-0">
                <div className="container-fluid p-2">
                     <Tabs tab="premium" />
                </div>
                <div className="container-fluid ps-3 pe-3">
                    <Filter First={100} Skip={0} Tab={"premium"} OrderBy={"expires"} OrderDirection={"asc"} Where={{
                            label_not: null,
                            expires_lte: moment().add(-GRACE_PERIOD, "days").utc().unix(),
                            expires_gte: moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix()
                    }} View="gallery" />
                </div>
        </div> 
        </>
    ) 
};

 
  
export default Premium;