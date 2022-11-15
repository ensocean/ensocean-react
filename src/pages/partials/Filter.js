import React, {useState, useEffect} from "react"; 
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getExpires, getTimeAgo, isExpired, isExpiring, isPremium, isValidName, jsonParse, jsonStringify, obscureAddress, obscureLabel, getTokenId } from '../../helpers/String';
import { useLazyQuery, gql } from '@apollo/client';
import { LazyLoadImage } from "react-lazy-load-image-component";
import spinner from '../../assets/spinner.svg'
import { CSVLink } from "react-csv";
import arrowLeft from "../../assets/arrow-left.svg";
import fileTypeCsv from "../../assets/filetype-csv.svg";
import listUl from "../../assets/list-ul.svg";
import gridFill from "../../assets/grid-fill.svg";
import funnelFill from "../../assets/funnel-fill.svg";
import arrowRepeat from "../../assets/arrow-repeat.svg";
import arrowRepeatSpin from "../../assets/arrow-repeat-spin.svg";
import searchIcon from "../../assets/search.svg";
import sortUp from "../../assets/sort-up.svg";
import sortDown from "../../assets/sort-down.svg";
import exclamationTriangleFill from "../../assets/exclamation-triangle-fill.svg";
import dashCircleFill from "../../assets/dash-circle-fill.svg";

const DEBOUNCE_INTERVAL = 500;
const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;

let timeout;
let csvHeaders = [
    { label: "Label", key: "label" },
    { label: "Extension", key: "extension" },
    { label: "Token ID", key: "tokenId" },
    { label: "Hash", key: "hash" },
    { label: "Created", key: "created" },
    { label: "Registered", key: "registered" },
    { label: "Expires", key: "expires" },
    { label: "Owner", key: "owner" },
    { label: "Length", key: "length" },
    { label: "Segment Length", key: "segmentLength" },
    { label: "Tags", key: "tags" }
];
 
const Filter = ({Tab, First, Skip, OrderBy, OrderDirection, Where, View}) => { 
      
    let location = useLocation(); 
    let navigate = useNavigate(); 
   
    console.log(Where);
  
    const [search, setSearch] = useState(location.search);
    const [tab, setTab] = useState(Tab);
    const [first, setFirst] = useState(First);
    const [skip, setSkip] = useState(Skip);
    const [orderBy, setOrderBy] = useState(OrderBy);
    const [orderDirection, setOrderDirection] = useState(OrderDirection);
    const [where, setWhere] = useState(Where); 
    const [view, setView] = useState(localStorage.getItem("view") || "gallery");
    const [csvData, setCsvData] = useState([]); 
    const [filterCount, setFilterCount] = useState(0); 
 
    let [getDomains, { called, loading, error, data, refetch } ] = useLazyQuery( gql(getQuery()), {
        variables: { skip, first, orderBy, orderDirection, where },
        notifyOnNetworkStatusChange: true
    }); 
 
    if(!called) getDomains();
 
    useEffect(() => {  

        const _search = location.search;
        const _query = new URLSearchParams(_search);
        const _tab = _query.get("tab") || Tab;
        const _first = _query.get("first") || First;
        const _skip = _query.get("skip") || Skip;
        const _orderBy = _query.get("orderBy") || OrderBy;
        const _orderDirection = _query.get("orderDirection") || OrderDirection; 
        const _where = jsonParse(_query.get("filter")) || Where; 
    
        setSearch(_search)
        setTab(_tab);  
        setFirst(Number(_first));  
        setSkip(Number(_skip)); 
        setOrderBy(_orderBy); 
        setOrderDirection(_orderDirection);  
        setWhere(_where);  
         
        getDomains( { variables: { _skip, _first, _orderBy, _orderDirection, _where } });
         
    }, [location]);

    useEffect(()=> {
        if(data && data.domains) setCsvData(data.domains.map(t=> { return { tokenId: getTokenId(t.label), ...t }}));
    }, [data])

 
     
    const handleFilterClick = (e) => {
        const elem = document.getElementById("filters");
        if(elem.classList.contains("d-none")) {
            elem.classList.remove("d-none") 
            elem.classList.add("d-block")  
        } else {
            elem.classList.add("d-none") 
            elem.classList.remove("d-block")  
        }   
    } 

    const handleRefreshClick = (e) => {   
        refetch();
    };

    const changeFilter = (value, prop) => {
        let _query = new URLSearchParams(location.search) 
        let _where = jsonParse(_query.get("filter")) || Where;
        if(value === "") { 
            delete _where[prop]; 
            setFilterCount(filterCount - 1);
        }  else { 
            console.log(_where[prop])
            console.log(value)
            if(!_where[prop]) {
                setFilterCount(filterCount + 1);
            }  
            _where[prop] = value; 
        }
        //setWhere(_where); 
        _query.set("filter",  jsonStringify(_where));
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleOrderBy = (e) => { 
        let _query = new URLSearchParams(location.search)
        _query.set("orderBy", e.target.value); 
        setOrderBy(e.target.value);
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handleOrderDirection = (e, t) => {  
        let _query = new URLSearchParams(location.search)
        let direction = orderDirection === "asc" ? "desc": "asc";
        _query.set("orderDirection", direction);
        setOrderDirection(direction)
        navigate(location.pathname + "?"+ _query.toString())
    } 
    
    const onKeydownSearch = (e) => {
        if( e.key === "Enter" ) {
            clearTimeout(timeout);
            changeFilter(e.target.value, "label_contains_nocase");
        }
    }

    const onChangeSearch = (e) => { 
        if(timeout) {  
            clearTimeout(timeout);
        } 
 
        timeout = setTimeout(()=> { 
            changeFilter(e.target.value, "label_contains_nocase");
        }, DEBOUNCE_INTERVAL); 
    }

    const onKeydownStartwith = (e) => {
        if( e.key === "Enter" ) {
            clearTimeout(timeout);
            changeFilter(e.target.value, "label_starts_with_nocase");
        }
    }

    const onChangeStartwith = (e) => {
        if(timeout) {  
            clearTimeout(timeout);
        } 
 
        timeout = setTimeout(()=> { 
            changeFilter(e.target.value, "label_starts_with_nocase");
        }, DEBOUNCE_INTERVAL); 
    }

    const onKeydownEndwith = (e) => {
        if( e.key === "Enter" ) {
            clearTimeout(timeout);
            changeFilter(e.target.value, "label_ends_with_nocase");
        }
    }

    const onChangeEndwith = (e) => {
        if(timeout) {  
            clearTimeout(timeout);
        } 
 
        timeout = setTimeout(()=> { 
            changeFilter(e.target.value, "label_ends_with_nocase");
        }, DEBOUNCE_INTERVAL); 
    } 

    const onKeydownMinLength= (e) => {
        if( e.key === "Enter" ) {
            clearTimeout(timeout);
            changeFilter(Number(e.target.value), "length_gte");
        }
    }

    const onChangeMinLength = (e) => {
        if(timeout) {  
            clearTimeout(timeout);
        } 
 
        timeout = setTimeout(()=> { 
            changeFilter(Number(e.target.value), "length_gte");
        }, DEBOUNCE_INTERVAL); 
    } 

    const onKeydownMaxLength= (e) => {
        if( e.key === "Enter" ) {
            clearTimeout(timeout);
            changeFilter(Number(e.target.value), "length_lte");
        }
    }

    const onChangeMaxLength = (e) => {
        if(timeout) {  
            clearTimeout(timeout);
        } 
 
        timeout = setTimeout(()=> { 
            changeFilter(Number(e.target.value), "length_lte");
        }, DEBOUNCE_INTERVAL); 
    }
  
    const onKeydownMinSegmentLength= (e) => {
        if( e.key === "Enter" ) {
            clearTimeout(timeout);
            changeFilter(Number(e.target.value), "segmentLength_gte");
        }
    }

    const onChangeMinSegmentLength = (e) => {
        if(timeout) {  
            clearTimeout(timeout);
        } 
 
        timeout = setTimeout(()=> { 
            changeFilter(Number(e.target.value), "segmentLength_gte");
        }, DEBOUNCE_INTERVAL); 
    }
  
    const onKeydownMaxSegmentLength= (e) => {
        if( e.key === "Enter" ) {
            clearTimeout(timeout);
            changeFilter(Number(e.target.value), "segmentLength_lte");
        }
    }

    const onChangeMaxSegmentLength = (e) => {
        if(timeout) {  
            clearTimeout(timeout);
        }  
        timeout = setTimeout(()=> { 
            changeFilter(Number(e.target.value), "segmentLength_lte");
        }, DEBOUNCE_INTERVAL); 
    }
 
    const handleResetFilter = (e) => {
        let _query = new URLSearchParams(location.search) 
        setWhere(Where);
        _query.set("filter",  jsonStringify(Where));
        setFilterCount(0);
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

    const onClickView = (e, v) => {
        localStorage.setItem("view", v); 
        setView(v);
    }
 
    return (
        <> 
        <div className="mb-3 t-20">  
            <div className="d-flex flex-lg-row flex-column justify-content-between gap-2"> 
                <div className="flex-fill"> 
                    <div className="flex-grow-1"> 
                        <div className="d-flex flex-row gap-2">
                            <button className="btn btn-outline-secondary rounded-0 position-relative" type="button" onClick={handleFilterClick}>
                                <img src={funnelFill} alt= ""  />
                                {filterCount > 0 && 
                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {filterCount}
                                        <span class="visually-hidden">selected filters</span>
                                    </span>
                                }
                            </button>
                            <button className="btn btn-outline-secondary rounded-0" type="button" onClick={handleRefreshClick}>
                                 <img src={loading ? arrowRepeatSpin: arrowRepeat } alt= ""  />
                            </button>
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-light border-end-0 rounded-0">
                                    <img src={searchIcon} alt= ""  />
                                </span>
                                <input type="text" className="form-control border-start-0 rounded-0" name="searchText" onChange={onChangeSearch} onKeyDown={onKeydownSearch} defaultValue={where?.label_contains_nocase} placeholder="Search Name"  /> 
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
                               <img src={sortUp} alt= ""  />
                            </button>
                        }
                        {orderDirection === "asc" &&
                            <button className="btn btn-outline-secondary rounded-0" type="button"  onClick={handleOrderDirection} >
                                <img src={sortDown} alt= ""  />
                            </button>
                        }
                    </div>
                </div> 
            </div>
        </div> 
        <div className="d-flex justify-content-between flex-column flex-lg-row">
            <div className="card overflow-auto d-block flex-shrink-1 h-100 sticky-top t-20 rounded-0" id="filters">
                <div className="card-header d-flex flex-row justify-content-between ">
                    <button className="btn fs-5 p-0 m-0 ">Filter</button> 
                    <button className="btn border-0" type="button" onClick={handleFilterClick}>
                        <img src={arrowLeft} alt= "" />
                    </button> 
                </div>
                <div className="card-body p-0">
                    <div className="accordion">
                        <div className="accordion-item border-0 rounded-0">
                            <button className="accordion-button fw-bold fs-4 rounded-0" type="button" data-bs-toggle="collapse" data-bs-target="#startsWith">
                                <h6 className="accordion-header">Starts/Ends With</h6>
                            </button> 
                            <div id="startsWith" className="accordion-collapse collapse show">
                                <div className="input-group gap-3 p-3 d-flex flex-row justify-content-between">
                                    <input type="text" name="startWith" onChange={onChangeStartwith} onKeyDown={onKeydownStartwith} defaultValue={where?.label_starts_with_nocase} className="form-control" placeholder="Start with" />
                                    <input type="text" name="endWith" onChange={onChangeEndwith} onKeyDown={onKeydownEndwith} defaultValue={where?.label_ends_with_nocase} className="form-control" placeholder="End with" />
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item border-0">
                            <button className="accordion-button fw-bold fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#length" >
                                <h6 className="accordion-header">Length</h6>
                            </button> 
                            <div id="length" className="accordion-collapse collapse show">
                                <div className="input-group gap-3 p-3 d-flex flex-row justify-content-between">
                                    <input type="number" name="minLength" onChange={onChangeMinLength} onKeyDown={onKeydownMinLength} defaultValue={where?.length_gte} className="form-control" placeholder="Min Length" />
                                    <input type="number" name="maxLength" onChange={onChangeMaxLength} onKeyDown={onKeydownMaxLength} defaultValue={where?.length_lte} className="form-control" placeholder="Max Length  " />
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item border-0">
                            <button className="accordion-button fw-bold fs-4" type="button" data-bs-toggle="collapse" data-bs-target="#segmentLength" >
                                <h6 className="accordion-header">Segment Length</h6>
                            </button> 
                            <div id="segmentLength" className="accordion-collapse collapse show">
                                <div className="input-group gap-3 p-3 d-flex flex-row justify-content-between">
                                    <input type="number" name="minSegmentLength" onChange={onChangeMinSegmentLength} onKeyDown={onKeydownMinSegmentLength} defaultValue={where?.segmentLength_gte} className="form-control" placeholder="Min Segment Length" />
                                    <input type="number" name="maxSegmentLength" onChange={onChangeMaxSegmentLength} onKeyDown={onKeydownMaxSegmentLength} defaultValue={where?.segmentLength_lte} className="form-control" placeholder="Max Segment Length  " />
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
                        <CSVLink filename={"ensocean-domain-results.csv"} data={csvData} headers={csvHeaders} data-bs-toogle="tooltip" data-bs-title="Download CSV" className="btn btn-default" >
                            <img src={fileTypeCsv} alt= "" />
                        </CSVLink> 
                    </div>
                    <div className="view-types">
                        <button type="button" className={view === "list" ? "btn btn-default active": "btn btn-default"} onClick={(e) => onClickView(e, "list")}>
                            <img src={listUl} alt= "" />
                        </button>  
                        <button type="button" className={view === "gallery" ? "btn btn-default active": "btn btn-default"} onClick={(e) => onClickView(e, "gallery")}>
                            <img src={gridFill} alt= "" />
                        </button>
                    </div> 
                </div>
                <div className="container-fluid border-top m-2 ps-0 pt-3" id="#results">
                    <FilterResults called={called} loading={loading} error={error} data={data} view={view} />
                </div> 
            </div> 
        </div> 
        </>
    );
};
 
  
function getQuery() {
    return `query Domains( $skip: Int!, $first: Int!, $orderBy: String!, $orderDirection: String!, $where: Domain_filter ) {
        domains ( 
            orderBy: $orderBy
            orderDirection: $orderDirection
            skip: $skip
            first: $first
            where: $where
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
 
 
const FilterResults = ( { called, loading, error, data, view }) => {
    if(!called) return;
 
    if (loading)  {

        if(view === "list") {
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
        } else {
            return (
                <>
                    <div className="row g-4 placeholder-wave">
                        {[...Array(12)].map((x, i) =>
                        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6" key={i}>
                            <div className="card h-100 text-start">
                                <div className="card-body p-0"> 
                                    <span className="placeholder w-100" style={{height: "290px"}}></span>
                                    <p className="card-text"> </p>
                                </div>
                                <div className="card-footer bg-white p-2 placeholder-wave">
                                    <h6 className="card-title m-0 fw-bold">
                                        <span className="placeholder w-75"></span>
                                    </h6>
                                    <small className="text-muted placeholder-wave">
                                        <span className="placeholder w-50"></span>
                                    </small>
                                </div>
                            </div>
                        </div> 
                        )}
                    </div>  
                </>
            )
        } 
    } else if (error) {
        return (
            <>
            <span className='text-danger'>{error.message}</span>     
            </>
        );
    } else {    

        if(view === "list") {
            return (
                <>
                <div className="table-responsive p-lg-3">
                    <table className='table table-hover m-0'>
                        <thead className="table-light fw-bold fs-6 text-left">
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
                                    <div className="d-flex">
                                        <div className="flex-shrink-0">
                                            <div className='bg-thumb' style={{width: "46px", height: "46px"}}>
                                                <LazyLoadImage
                                                    alt={domain.name} 
                                                    className="img-fluid h-100 w-100 border border-2"
                                                    width={"46px"}
                                                    height={"46px"}
                                                    onError={(e)=> { e.target.style.display = "none"; e.target.parentNode.style.display = "none"; }}
                                                    placeholderSrc={spinner}
                                                    visibleByDefault={false}
                                                    src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label)) }
                                                    />
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 ms-3 d-flex align-items-start">
                                            <Link
                                            className="text-decoration-none link-dark fs-5 fw-bold" 
                                            data-bs-toggle="tooltip" 
                                            data-bs-title={"View "+ domain.name +" on EnsOcean"}
                                            title={"View "+ domain.name +" on EnsOcean"}
                                            to={"/"+ encodeURIComponent(domain.name) }>
                                                {obscureLabel(domain.label, 20)}.{domain.extension || "eth"}
                                            </Link> 
                                            &nbsp;
                                            { (domain.tags.includes("include-unicode") || domain.tags.includes("only-unicode")) && 
                                                <span data-bs-toogle="tooltip" data-bs-title="Include unicode characters">
                                                    <img src={exclamationTriangleFill} alt= ""  />
                                                </span>
                                            }
                                            &nbsp;
                                            { !isValidName(domain.label) && 
                                                <span data-bs-toogle="tooltip" data-bs-title="This domain is malformed!">
                                                    <img src={dashCircleFill} alt= ""  />
                                                </span>
                                            }
                                        </div>
                                    </div> 
                                </td> 
                                <td className="p-3"> 
                                    {(function() {
                                        if (isPremium(domain.expires) ) {
                                        return (<small className="text-success">Available in Premium since { getExpires(domain.expires, true)  }</small>)
                                        } else if(isExpiring(domain.expires)) {
                                        return (<small className="text-warning"> In grace period since {  getExpires(domain.expires, true)  }</small>)
                                        } else if(isExpired(domain.expires)) {
                                        return (<small className="text-success"> Available since {  getExpires(domain.expires, true)  } </small>)
                                        } else {
                                            return (<small className="text-muted">{  getExpires(domain.expires, false) } </small>)
                                        }
                                    })()} 
                                </td>
                                <td className="p-3"> 
                                    <Link
                                    className="text-decoration-none link-dark btn btn-outline-warning" 
                                    data-bs-toggle="tooltip" 
                                    data-bs-title={"Domains of "+ domain.name +""}
                                    title={"Domains of "+ domain.owner +""}
                                    to={"/account/"+ domain.owner }>{obscureAddress(domain.owner || "", 20)} 
                                    </Link> 
                                </td>
                                <td className="p-3">{getTimeAgo(domain.created)}</td>
                                <td className="p-3">{getTimeAgo(domain.registered)}</td>
                                <td className="p-3"> </td>
                            </tr>
                            ))}  
                        </tbody>
                    </table>
                </div>
                </>
            )
        } else {
            return (
                <> 
                <div className="row g-4">
                    {data.domains.length < 1 &&
                        <div className="col-12 text-center text-warning">No Result found</div>
                    } 
                    {data.domains.map((domain) => (
                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6" key={domain.id}>
                        <div className="card h-100 text-start"> 
                            <LazyLoadImage
                                alt={domain.name} 
                                className="img-fluid card-img-top"
                                onError={(e)=> { e.target.style.display = "none"; e.target.parentNode.style.display = "none"; }}
                                placeholderSrc={spinner}
                                visibleByDefault={false}
                                src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label)) }
                                /> 
                            <div className="card-body p-2">
                                <h5 className="card-title m-0 fw-bold">
                                    <Link
                                        className="text-decoration-none link-dark" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-title={"View "+ domain.name +" on EnsOcean"}
                                        title={"View "+ domain.name +" on EnsOcean"}
                                        to={"/"+ encodeURIComponent(domain.name) }>
                                            {obscureLabel(domain.label, 20)}.{domain.extension || "eth"}
                                        </Link> 
                                        &nbsp;
                                        { (domain.tags.includes("include-unicode") || domain.tags.includes("only-unicode")) && 
                                            <span data-bs-toogle="tooltip" data-bs-title="Include unicode characters">
                                                <img src={exclamationTriangleFill} alt= "" />
                                            </span>
                                        }
                                        &nbsp;
                                        { !isValidName(domain.label) && 
                                            <span data-bs-toogle="tooltip" data-bs-title="This domain is malformed!">
                                                <img src={dashCircleFill} alt= ""  />
                                            </span>
                                        }
                                </h5>
                                <p className="card-text"></p>
                            </div>
                            <div className="card-footer bg-white p-2">
                                <small className="text-muted">
                                    {(function() {
                                        if (isPremium(domain.expires) ) {
                                        return (<small className="text-success">Available in Premium since { getExpires(domain.expires, true)  }</small>)
                                        } else if(isExpiring(domain.expires)) {
                                        return (<small className="text-warning"> In grace period since {  getExpires(domain.expires, true)  }</small>)
                                        } else if(isExpired(domain.expires)) {
                                        return (<small className="text-success"> Available since {  getExpires(domain.expires, true)  } </small>)
                                        } else {
                                            return (<small className="text-muted"> Expires {  getExpires(domain.expires, false) } </small>)
                                        }
                                    })()} 
                                </small>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>  
                </>
            ) 
        } 
    }  
}

 
export default Filter;