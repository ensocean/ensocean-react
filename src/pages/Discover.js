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
            <Filter pageTitle={"Dropped Domains"}  currentTab={tab} currentOrderBy={"expires"} currentOrderDirection={"desc"} currentFilter={filterStr} />
        )
    } else if(tab === "expiring") { 
        filter.expires_lte = moment().utc().unix();
        filter.expires_gte = moment().add(-PREMIUM_PERIOD, "days").utc().unix();
        const filterStr = getFilterObjStr(filter);
        return ( 
            <Filter pageTitle={"Expiring Soon"}  currentTab={tab} currentOrderBy={"expires"} currentOrderDirection={"asc"} currentFilter={filterStr} />
        )
    } else if(tab === "premium") { 
        filter.expires_lte = moment().add(-GRACE_PERIOD, "days").utc().unix();
        filter.expires_gte = moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix();
        const filterStr = getFilterObjStr(filter);
        return ( 
            <Filter pageTitle={"Premium Right Now"}  currentTab={tab} currentOrderBy={"expires"} currentOrderDirection={"asc"} currentFilter={filterStr} />
        )
    } else if(tab === "registered") {
        filter.registered_not = null;
        const filterStr = getFilterObjStr(filter);
        return (
            <Filter pageTitle={"Recently Registered"}  currentTab={tab} currentOrderBy={"registered"} currentOrderDirection={"desc"} currentFilter={filterStr} />
        )
    } else {
        const filterStr = getFilterObjStr(filter);
        return (
            <Filter pageTitle={"Browse ENS Domains"} currentTab={tab} currentOrderBy={"created"} currentOrderDirection={"desc"} currentFilter={filterStr} />
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