import React, {useState, useEffect} from "react"; 
import { useLocation, Link, useNavigate } from "react-router-dom";
import {Helmet} from "react-helmet"; 
import moment from 'moment'; 
import TimeAgo from "javascript-time-ago"; 
import en from 'javascript-time-ago/locale/en'
import { obscureAddress, obscureLabel } from '../helpers/String';
import json5 from "json5";
import { useLazyQuery, useQuery, gql } from '@apollo/client';


TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo();
 
const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);
  
function getFilterObj(filter) {
    let _filter = json5.parse(filter, {quote: '"'});
    if(!_filter.label_not)
        _filter.label_not = null;
    return _filter;
}

function getFilterObjStr(filter) {
    return json5.stringify(filter, { quote: '"'})
}

const Discover = () => { 
    
    const DEFAULT_TAB = "all";
    const DEFAULT_ORDER_BY = "created";
    const DEFAULT_ORDER_DIRECTION = "desc";
    const DEFAULT_FILTER = "{ label_not: null }";

    let location = useLocation(); 
    let navigate = useNavigate(); 
 
    const [search, setSearch] = useState(location.search);
    const [tab, setTab] = useState(DEFAULT_TAB);
    const [filter, setFilter] = useState(DEFAULT_FILTER);
    const [skip, setSkip] = useState(0);
    const [first, setFirst] = useState(50);
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(DEFAULT_ORDER_DIRECTION);
    const [pageTitle, setPageTitle] = useState("Discover ENS Domains")
   
    let _search = location.search;
    let _query = new URLSearchParams(_search);  
    let _tab = _query.get("tab"); 
 
    const [getDomains, { called, loading, error, data, refetch } ] = useLazyQuery( gql(getQuery(filter)), {
        variables: { skip, first, orderBy, orderDirection },
        notifyOnNetworkStatusChange: true
    });
 
    useEffect(() => {  
            
        let _search = location.search;
        let _query = new URLSearchParams(_search); 
        let _skip = Number(_query.get("skip") || "0");
        let _first = Number(_query.get("first") || "50");
        let _orderBy = _query.get("orderBy") || "expires";
        let _orderDirection = _query.get("orderDirection") || "desc"; 
        let _filter = _query.get("filter") || DEFAULT_FILTER;  
     
        setTab(_tab); 
        setSearch(_search); 
        setOrderBy(_orderBy);
        setOrderDirection(_orderDirection); 
        setFilter(_filter); 
        getDomains();
 
    }, [location, _tab, getDomains, refetch]);

     
    const handleFilterClick = (e) => {
        const elem = document.getElementById("filters");
        console.log(elem.classList )

        if(elem.classList.contains("d-none")) {
            elem.classList.remove("d-none") 
            elem.classList.add("d-block")  
        } else {
            elem.classList.add("d-none") 
            elem.classList.remove("d-block")  
        }   
    } 

    const handleRefreshClick = (e) => {  
        
       refetch( );
 
    };

    const handleOrderBy = (e) => { 
        let _query = new URLSearchParams(search)
        _query.set("orderBy", e.target.value); 
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleOrderDirection = (e, t) => {  
        let _query = new URLSearchParams(search)
        _query.set("orderDirection", orderDirection === "asc" ? "desc": "asc");
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleSearchText = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj(_query.get("filter") || DEFAULT_FILTER);
        if(e.target.value == "") { 
            delete _filter.label_contains;
        }  else {
            _filter.label_contains = e.target.value; 
            
        }
        setFilter(getFilterObjStr(_filter));
        _query.set("filter",  getFilterObjStr(_filter));
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleStartWith = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj(_query.get("filter") || DEFAULT_FILTER); 
        
        if(e.target.value !== "")
            _filter.label_starts_with = e.target.value; 
        else 
            delete _filter.label_starts_with;

        let filterStr = getFilterObjStr(_filter);
        setFilter(filterStr);
        _query.set("filter",  filterStr);
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleEndWith = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj(_query.get("filter") || DEFAULT_FILTER); 
        if(e.target.value !== "")
            _filter.label_ends_with = e.target.value;
        else 
            delete _filter.label_ends_with;
        let filterStr = getFilterObjStr(_filter);
        setFilter(filterStr);
        _query.set("filter",  filterStr);
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleMinLength = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj(_query.get("filter") || DEFAULT_FILTER);  
        if(e.target.value !== "")
            _filter.length_gte = Number(e.target.value); 
        else 
           delete _filter.length_gte;
        let filterStr = getFilterObjStr(_filter);
        setFilter(filterStr);
        _query.set("filter",  filterStr);
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleMaxLength = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj(_query.get("filter") || DEFAULT_FILTER);
        
        if(e.target.value !== "")
         _filter.length_lte = Number(e.target.value);
        else 
            delete _filter.length_lte;
        let filterStr = getFilterObjStr(_filter);
        setFilter(filterStr);
        _query.set("filter",  filterStr);
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleMinSegmentLength = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj(_query.get("filter") || DEFAULT_FILTER);
        
        if(e.target.value !== "")
            _filter.segmentLength_gte = Number(e.target.value); 
        else 
            delete _filter.segmentLength_gte;
        let filterStr = getFilterObjStr(_filter);
        setFilter(filterStr);
        _query.set("filter",  filterStr);
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleMaxSegmentLength = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj(_query.get("filter") || DEFAULT_FILTER);
        if(e.target.value !== "")
            _filter.segmentLength_lte = Number(e.target.value); 
        else 
            delete _filter.segmentLength_lte;
        let filterStr = getFilterObjStr(_filter);
        setFilter(filterStr);
        _query.set("filter",  filterStr);
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleResetFilter = (e) => {
        let _query = new URLSearchParams(search) 
        let _filter = getFilterObj( DEFAULT_FILTER); 
        let filterStr = getFilterObjStr(_filter);
        setFilter(filterStr);
        _query.set("filter",  filterStr);
        emptyFilters();
        navigate(location.pathname + "?"+ _query.toString())
    }

    const emptyFilters = () => {
        document.getElementsByName("minLength")[0].value = "";
        document.getElementsByName("maxLength")[0].value = "";
        document.getElementsByName("minSegmentLength")[0].value = "";
        document.getElementsByName("maxSegmentLength")[0].value = "";
        document.getElementsByName("startWith")[0].value = "";
        document.getElementsByName("endWith")[0].value = "";
        document.getElementsByName("searchText")[0].value = "";
    }
 
    return (
        <>
        <Helmet> 
                <title>Browse Ethereum Name Service (ENS) Domains - EnsOcean</title>
                <meta name="description" content="Browse Ethereum Name Service (ENS) domains easily. Find your web3 domain name idea. " />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>{pageTitle}</h1>
            </div> 
        </div>
        <div className="container-fluid p-0 m-0">
            <div className="card text-center">
                <div className="card-header border-0">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <Link className={"nav-link fs-5 p-3 "+ (tab === "all" ? "active": "") } to="/discover?tab=all">All</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link fs-5 p-3 "+ (tab === "expired" ? "active": "")} to="/discover?tab=expired">Expired</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link fs-5 p-3 "+ (tab === "expiring" ? "active": "")} to="/discover?tab=expiring">Expiring</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={" nav-link fs-5 p-3 "+ (tab === "premium" ? "active": "")} to="/discover?tab=premium">Premium</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={"nav-link fs-5  p-3 "+ (tab === "registered" ? "active": "")} to="/discover?tab=registered">Recently Registered</Link>
                        </li> 
                    </ul> 
                </div>
                <div className="card-body">
                    <div className="sticky-top mb-3 t-20">  
                        <div className="d-flex flex-lg-row flex-column justify-content-between gap-2"> 
                            <div className="flex-fill"> 
                                <div className="flex-grow-1"> 
                                    <div className="d-flex flex-row gap-2">
                                        <button className="btn btn-outline-secondary rounded-0" type="button" onClick={handleFilterClick}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                                                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                                            </svg>
                                        </button>
                                        <button className="btn btn-outline-secondary rounded-0" type="button" onClick={handleRefreshClick}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                                                <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                                            </svg>
                                        </button>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-light border-end-0 rounded-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                                </svg>
                                            </span>
                                            <input type="text" className="form-control border-start-0 rounded-0" name="searchText" onChange={handleSearchText} value={getFilterObj(filter).label_contains} placeholder="Search Name"  /> 
                                        </div> 
                                    </div> 
                                </div>
                            </div> 
                            <div className="">
                                <div className="input-group input-group-lg gap-2">
                                    <select className="form-select rounded-0" onChange={handleOrderBy} value={orderBy}>
                                        <option value="expires">Expiration</option>
                                        <option value="registered">Registration</option>
                                        <option value="created">Creation</option>
                                        <option value="label">Name</option>
                                        <option value="length">Length</option>
                                    </select>
                                    {orderDirection === "desc" &&
                                        <button className="btn btn-outline-secondary rounded-0" type="button"  onClick={handleOrderDirection} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                                            </svg>
                                        </button>
                                    }
                                    {orderDirection === "asc" &&
                                        <button className="btn btn-outline-secondary rounded-0" type="button"  onClick={handleOrderDirection} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                                <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293V2.5zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                                            </svg>
                                        </button>
                                    }
                                </div>
                            </div> 
                        </div>
                    </div> 
                    <div className="d-flex justify-content-between flex-column flex-lg-row">
                        <div className="card sticky-top h-50 overflow-auto mt-1 t-60 d-none flex-shrink-0" id="filters">
                            <div className="card-header d-flex flex-row justify-content-between">
                                <button className="btn fs-5 p-0 m-0">Filter</button> 
                                <button className="btn border-0" type="button" onClick={handleFilterClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                                    </svg>
                                </button> 
                            </div>
                            <div className="card-body p-0">
                                <div className="accordion">
                                    <div className="accordion-item border-0">
                                        <button className="accordion-button fw-bold fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#startsWith">
                                            <h6 className="accordion-header">Starts/Ends With</h6>
                                        </button> 
                                        <div id="startsWith" className="accordion-collapse collapse show">
                                            <div className="input-group gap-3 p-3 d-flex flex-row justify-content-between">
                                                <input type="text" name="startWith" onChange={handleStartWith} value={getFilterObj(filter).label_starts_with} className="form-control" placeholder="Start with" />
                                                <input type="text" name="endWith" onChange={handleEndWith} value={getFilterObj(filter).label_ends_with} className="form-control" placeholder="End with" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item border-0">
                                        <button className="accordion-button fw-bold fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#length" >
                                            <h6 className="accordion-header">Length</h6>
                                        </button> 
                                        <div id="length" className="accordion-collapse collapse show">
                                            <div className="input-group gap-3 p-3 d-flex flex-row justify-content-between">
                                                <input type="number" name="minLength" onChange={handleMinLength} value={getFilterObj(filter).length_gte} className="form-control" placeholder="Min Length" />
                                                <input type="number" name="maxLength" onChange={handleMaxLength} value={getFilterObj(filter).length_lte} className="form-control" placeholder="Max Length  " />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item border-0">
                                        <button className="accordion-button fw-bold fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#segmentLength" >
                                            <h6 className="accordion-header">Segment Length</h6>
                                        </button> 
                                        <div id="segmentLength" className="accordion-collapse collapse show">
                                            <div className="input-group gap-3 p-3 d-flex flex-row justify-content-between">
                                                <input type="number" name="minSegmentLength" onChange={handleMinSegmentLength} value={getFilterObj(filter).segmentLength_gte} className="form-control" placeholder="Min Segment Length" />
                                                <input type="number" name="maxSegmentLength" onChange={handleMaxSegmentLength} value={getFilterObj(filter).segmentLength_lte} className="form-control" placeholder="Max Segment Length  " />
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline-primary mb-3" type="button" onClick={handleResetFilter} >
                                        Reset Filters
                                    </button> 
                                </div>
                            </div> 
                        </div> 
                        <div className="flex-lg-fill w-100 flex-shrink-0"> 
                            <div className="d-flex justify-content-between">
                                <div className="csv-download">
                                    <button type="button" className="btn btn-default" data-bs-toogle="tooltip" data-bs-title="Download CSV">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-filetype-csv" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z"/>
                                    </svg>
                                    </button>
                                </div>
                                <div className="view-types">
                                    <button type="button" className="btn btn-default">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-list-ul" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                        </svg>
                                    </button> 
                                    <button type="button" className="btn btn-default">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-grid-3x3-gap-fill" viewBox="0 0 16 16">
                                        <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/>
                                    </svg>
                                    </button> 
                                    <button type="button" className="btn btn-default">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-grid-fill" viewBox="0 0 16 16">
                                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                                        </svg>
                                    </button>
                                </div> 
                            </div>
                            <div className="results">
                                <FilterResults called={called} loading={loading} error={error} data={data} refetch={refetch}  />
                            </div> 
                        </div> 
                    </div>  
                </div>
            </div>
        </div>
        </>
    );
};
 
  
function getQuery(filters) {
    return `query Domains( $skip: Int!, $first: Int!, $orderBy: String!, $orderDirection: String! ) {
        domains ( 
            orderBy: $orderBy
            orderDirection: $orderDirection
            skip: $skip
            first: $first
            where: ${filters}
        )
        {  
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
            extension
            segmentLength
            tags
        }
    }`;
}
 
 
const FilterResults = ( { called, loading, error, data }) => {
     
    if(!called) return;

    if ( loading)  {
        return ( 
            <>
            <div className='table-responsive p-lg-3 placeholder-glow'>
                <table className='table table-hover m-0'>
                    <thead className="table-light fw-bold fs-6">
                        <tr>
                            <th className="p-3">Name</th> 
                            <th className="p-3">Expires</th>
                            <th className="p-3">Owner</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody> 
                         {[...Array(10)].map((x, i) =>
                        <tr key={i}>
                            <td className="p-3"><span className="placeholder col-12"></span></td> 
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                            <td className="p-3"><span className="placeholder col-12"></span></td>
                        </tr>
                         )}
                    </tbody>
                </table>
            </div>  
            </>     
        )
    } else if (error) {
        return (
            <>
            <div className="table-responsive p-lg-3">
                <table className='table table-hover m-0'>
                    <thead className="table-light fw-bold fs-6">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Expires</th> 
                            <th className="p-3">Owner</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="6" className='p-3'><span className='text-danger'>{error.message}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div> 
            </>
        );
    } else {  
        return (
            <>
            <div className="table-responsive p-lg-3">
                <table className='table table-hover m-0'>
                    <thead className="table-light fw-bold fs-6">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Expires</th> 
                            <th className="p-3">Owner</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.domains.length < 1 &&
                            <tr>
                                <td colSpan='6' className='p-3'><span className='text-warning'>No Result</span></td>
                            </tr>
                        } 
                        {data.domains.map((domain) => (
                        <tr key={domain.id}>
                            <td className="p-3">
                                <Link
                                className="text-decoration-none" 
                                data-bs-toggle="tooltip" 
                                data-bs-title={"View "+ domain.name +" on EnsOcean"}
                                title={"View "+ domain.name +" on EnsOcean"}
                                to={"/"+ domain.name }>{obscureLabel(domain.name, 20)}</Link> 
                            </td> 
                            <td className="p-3">{timeAgo.format(moment.unix(domain.expires).add(GRACE_PERIOD, "days").add(PREMIUM_PERIOD, "days").toDate())} </td>
                            <td className="p-3">{obscureAddress(domain.owner || "", 20)} </td>
                            <td className="p-3">{timeAgo.format(moment.unix(domain.created).toDate())} </td>
                            <td className="p-3">{timeAgo.format(moment.unix(domain.registered).toDate())}</td>
                            <td className="p-3"> </td>
                        </tr>
                        ))}  
                    </tbody>
                </table>
            </div> 
            </>
        )
    }  
}

export default Discover;