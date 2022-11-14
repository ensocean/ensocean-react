import React from "react"; 
import { useLocation  } from "react-router-dom";
import Filter from "./partials/Filter";
import moment from 'moment'; 

const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

const Discover = () => { 
    const location = useLocation();
    const query = new URLSearchParams(location.search);  
    const tab = query.get("tab");  
    let where = { label_not: null }; 

    if(tab === "expired") { 
        where.expires_lte = moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix(); 
        return (
            <Filter PageTitle={"Dropped Domains"} First={100} Skip={0} Tab={tab} OrderBy={"expires"} OrderDirection={"desc"} Where={where} />
        )
    } else if(tab === "expiring") { 
        where.expires_lte = moment().utc().unix();
        where.expires_gte = moment().add(-PREMIUM_PERIOD, "days").utc().unix();
        return ( 
            <Filter PageTitle={"Expiring Soon"} First={100} Skip={0} Tab={tab} OrderBy={"expires"} OrderDirection={"asc"} Where={where} />
        )
    } else if(tab === "premium") { 
        where.expires_lte = moment().add(-GRACE_PERIOD, "days").utc().unix();
        where.expires_gte = moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix();
        return ( 
            <Filter PageTitle={"Premium Right Now"} First={100} Skip={0} Tab={tab} OrderBy={"expires"} OrderDirection={"asc"} Where={where} />
        )
    } else if(tab === "registered") {
        where.registered_not = null;
        return (
            <Filter PageTitle={"Recently Registered"} First={100} Skip={0} Tab={tab} OrderBy={"registered"} OrderDirection={"desc"} Where={where} />
        )
    } else {
        return (
            <Filter PageTitle={"Browse ENS Domains"} First={100} Skip={0} Tab={tab} OrderBy={"created"} OrderDirection={"desc"} Where={where} />
        )
    } 
};
  
export default Discover;