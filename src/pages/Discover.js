import React from "react"; 
import { useLocation  } from "react-router-dom";
import Filter from "./partials/Filter";
import moment from 'moment'; 
import json5 from "json5";

const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

const Discover = () => { 
    const location = useLocation();
    const query = new URLSearchParams(location.search);  
    const tab = query.get("tab"); 
    const DEFAULT_FILTER = "{ label_not: null }";
    let filter = getFilterObj(DEFAULT_FILTER); 

    if(tab === "expired") { 
        filter.expires_lte = moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix(); 
        const filterStr = getFilterObjStr(filter);
        return (
            <Filter PageTitle={"Dropped Domains"} First={50} Skip={0} Tab={tab} OrderBy={"expires"} OrderDirection={"desc"} Filter={filterStr} />
        )
    } else if(tab === "expiring") { 
        filter.expires_lte = moment().utc().unix();
        filter.expires_gte = moment().add(-PREMIUM_PERIOD, "days").utc().unix();
        const filterStr = getFilterObjStr(filter);
        return ( 
            <Filter PageTitle={"Expiring Soon"} First={50} Skip={0} Tab={tab} OrderBy={"expires"} OrderDirection={"asc"} Filter={filterStr} />
        )
    } else if(tab === "premium") { 
        filter.expires_lte = moment().add(-GRACE_PERIOD, "days").utc().unix();
        filter.expires_gte = moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix();
        const filterStr = getFilterObjStr(filter);
        return ( 
            <Filter PageTitle={"Premium Right Now"} First={50} Skip={0} Tab={tab} OrderBy={"expires"} OrderDirection={"asc"} Filter={filterStr} />
        )
    } else if(tab === "registered") {
        filter.registered_not = null;
        const filterStr = getFilterObjStr(filter);
        return (
            <Filter PageTitle={"Recently Registered"} First={50} Skip={0} Tab={tab} OrderBy={"registered"} OrderDirection={"desc"} Filter={filterStr} />
        )
    } else {
        const filterStr = getFilterObjStr(filter);
        return (
            <Filter PageTitle={"Browse ENS Domains"} First={50} Skip={0} Tab={tab} OrderBy={"created"} OrderDirection={"desc"} Filter={filterStr} />
        )
    } 
};

function getFilterObj(filter) {
    let _filter = json5.parse(filter, {quote: '"'});
    if(!_filter.label_not)
        _filter.label_not = null;
    return _filter;
}

function getFilterObjStr(filter) {
    return json5.stringify(filter, { quote: '"'})
}
  
export default Discover;