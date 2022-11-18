import React, {useState, useEffect, useRef} from "react"; 
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
import notAvailable from "../../assets/not-available.svg";
import moment from 'moment'; 

const DEBOUNCE_INTERVAL = 500;
const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;
const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

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

let defaultTags = [
    "include-letter",
    "only-letter",
    "include-digit",
    "only-digit",
    "include-unicode",
    "only-unicode",
    "include-emoji",
    "only-emoji",
    "include-arabic",
    "only-arabic",
    "palindrome"
];

 
const Filter = ({Tab, First, Skip, OrderBy, OrderDirection, Where, View}) => { 
      
    const listInnerRef = useRef();

    let location = useLocation(); 
    let navigate = useNavigate(); 
     
    const _search = location.search;
    let _query = new URLSearchParams(_search);
    let _tab = _query.get("tab") || Tab;
    let _first = _query.get("first") || First;
    let _skip = _query.get("skip") || Skip;
    let _orderBy = _query.get("orderBy") || OrderBy;
    let _orderDirection = _query.get("orderDirection") || OrderDirection; 
    let _where = jsonParse(_query.get("filter")) || Where; 
    let _view = localStorage.getItem("view") || _query.get("_view") || View;  

    const [search, setSearch] = useState(_search);
    const [tab, setTab] = useState(Tab);
    const [first, setFirst] = useState(_first);
    const [skip, setSkip] = useState(_skip);
    const [orderBy, setOrderBy] = useState(_orderBy);
    const [orderDirection, setOrderDirection] = useState(_orderDirection);
    const [where, setWhere] = useState(_where); 
    const [view, setView] = useState(_view); 
    const [csvData, setCsvData] = useState([]); 
    const [filterCount, setFilterCount] = useState(0); 
   
    let [getDomains, { called, loading, error, data, refetch } ] = useLazyQuery( gql(getQuery()), {
        variables: { skip, first, orderBy, orderDirection, where },
        notifyOnNetworkStatusChange: true
    }); 

    if(!called)  {  
        getDomains();
    }
  
    useEffect(() => {  
  
         _query = new URLSearchParams(_search);
         _tab = _query.get("tab") || Tab;
         _first = _query.get("first") || First;
         _skip = _query.get("skip") || Skip;
         _orderBy = _query.get("orderBy") || OrderBy;
         _orderDirection = _query.get("orderDirection") || OrderDirection; 
         _where = jsonParse(_query.get("filter")) || Where; 
         _view = localStorage.getItem("view") || _query.get("_view") || View;  
        
        setSearch(_search)
        setTab(_tab);  
        setWhere(_where);  
        setOrderBy(_orderBy);
        setOrderDirection(_orderDirection);
        setSkip(_skip);
        setFirst(_first); 

        //refetch();
        getDomains();
          
    }, [location]);

    useEffect(()=> {
        if(data && data.domains) setCsvData(data.domains.map(t=> { return { tokenId: getTokenId(t.label), ...t }}));
    }, [data])

    
    const handleFilterClick = (e) => {
        const elem = document.getElementById("filters");
        if(elem.classList.contains("d-none")) {
            elem.classList.add("d-lg-block")
            elem.classList.remove("d-none") 
        } else { 
            elem.classList.remove("d-lg-block") 
            elem.classList.add("d-none") 
        }   
    } 

    const handleRefreshClick = (e) => {   
        refetch();
    };

    const onChangeTag = (e) => { 
        
        let existsTags = _where.tags_contains;
        if(e.target.checked) { 
            if(existsTags) {
                if(!existsTags.includes(e.target.value)) {
                    existsTags.push(e.target.value);
                    changeFilter(existsTags, "tags_contains");
                } 
            } else {
                existsTags = [e.target.value]
                changeFilter(existsTags, "tags_contains");
            }
        } else { 
            if(existsTags) {
                if(existsTags.includes(e.target.value)) {
                    existsTags.splice(existsTags.indexOf(e.target.value), 1);
                    if(existsTags.length < 1) {
                        changeFilter(null, "tags_contains");
                    } else {
                        changeFilter(existsTags, "tags_contains");
                    }
                }  
            } else { 
                changeFilter(null, "tags_contains");
            }
        }
    }

    const changeFilter = (value, prop) => {
        let _query = new URLSearchParams(search) 
        let newWhere = jsonParse(_query.get("filter")) || where;
        if(value === null || value === undefined || value === "") { 
            delete newWhere[prop]; 
            setFilterCount(filterCount - 1);
        }  else {  
            if(!newWhere[prop]) {
                setFilterCount(filterCount + 1);
            } 
            newWhere[prop] = value; 
        }
        _query.set("filter",  jsonStringify(newWhere)); 
        setWhere(newWhere);
        getDomains({ variables: { skip, first, orderBy, orderDirection, newWhere } });
        navigate(location.pathname + "?"+ _query.toString()) 
    }

    const handleOrderBy = (e) => { 
        let _query = new URLSearchParams(location.search)
        _query.set("orderBy", e.target.value); 
        setOrderBy(e.target.value); 
        navigate(location.pathname + "?"+ _query.toString())
    }

    const handlePagePrev = (e) => { 
        let nextSkip = skip - first;
        let _query = new URLSearchParams(location.search)
        _query.set("skip", nextSkip); 
        setSkip(nextSkip);
        navigate(location.pathname + "?"+ _query.toString());
    }

    const handlePageNext = (e) => { 
        let nextSkip = skip + first;
        let _query = new URLSearchParams(location.search)
        _query.set("skip", nextSkip);  
        setSkip(nextSkip);
        navigate(location.pathname + "?"+ _query.toString());
    }

    const handleOrderDirection = (e, t) => {  
        let _query = new URLSearchParams(location.search)
        let direction = orderDirection === "asc" ? "desc": "asc";
        _query.set("orderDirection", direction);
        setOrderDirection(direction); 
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
        let _query = new URLSearchParams(_search) 
        setWhere(Where);
        _query.set("filter",  jsonStringify(Where));
        setFilterCount(0);
        emptyFilters();
        refetch();
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
        document.getElementsByName("tags").forEach((t)=> t.checked = false);
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
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {filterCount}
                                        <span className="visually-hidden">selected filters</span>
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
                <div className="d-flex">
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
        <div className="container-fluid">
            <div className="d-flex flex-column flex-lg-row">
                <div className="flex-shrink-0 me-lg-2 mb-2" id="filters" >
                    <div className="card rounded-0" id="filters">
                        <div className="card-header d-flex flex-row justify-content-between ">
                            <button className="btn fs-5">Filter</button>
                            <button className="btn border-0" type="button" onClick={handleFilterClick}>
                                <img src={arrowLeft} />
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="accordion">
                                <div className="accordion-item border-0 rounded-0">
                                    <button className="accordion-button fw-bold fs-4 rounded-0 bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#charSet">
                                        <h5 className="accordion-header fw-bold text-dark">Character Set</h5>
                                    </button> 
                                    <div id="charSet" className="accordion-collapse collapse show overflow-auto text-muted p-3" style={{height: "240px"}}>
                                        {defaultTags.map((t) =>
                                            <div key={t} className="input-group p-2 d-flex flex-row justify-content-between align-items-between">
                                                <label htmlFor={t} className="cursor-pointer">{t}</label>
                                                <input name="tags" className="form-check-input" type="checkbox" id={t} value={t} onChange={onChangeTag} />
                                            </div>
                                        )} 
                                    </div>
                                </div>
                                <div className="accordion-item border-0 rounded-0">
                                    <button className="accordion-button fw-bold fs-4 rounded-0 bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#startsWith">
                                        <h5 className="accordion-header fw-bold text-dark">Starts/Ends With</h5>
                                    </button> 
                                    <div id="startsWith" className="accordion-collapse collapse show">
                                        <div className="input-group p-3">
                                            <input type="text" name="startWith" onChange={onChangeStartwith} onKeyDown={onKeydownStartwith} defaultValue={where?.label_starts_with_nocase} className="form-control" placeholder="Starts with" />
                                            <span className="input-group-text">and</span>                                    
                                            <input type="text" name="endWith" onChange={onChangeEndwith} onKeyDown={onKeydownEndwith} defaultValue={where?.label_ends_with_nocase} className="form-control" placeholder="Ends with" />
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item border-0">
                                    <button className="accordion-button fw-bold fs-4 bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#length" >
                                        <h5 className="accordion-header fw-bold text-dark">Length</h5>
                                    </button> 
                                    <div id="length" className="accordion-collapse collapse show">
                                        <div className="input-group p-3">
                                            <input type="number" name="minLength" onChange={onChangeMinLength} onKeyDown={onKeydownMinLength} defaultValue={where?.length_gte} className="form-control" placeholder="Min" />
                                            <span className="input-group-text">to</span>
                                            <input type="number" name="maxLength" onChange={onChangeMaxLength} onKeyDown={onKeydownMaxLength} defaultValue={where?.length_lte} className="form-control" placeholder="Max  " />
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item border-0">
                                    <button className="accordion-button fw-bold fs-4 bg-white border-0" type="button" data-bs-toggle="collapse" data-bs-target="#segmentLength" >
                                        <h5 className="accordion-header fw-bold text-dark">Segment Length</h5>
                                    </button> 
                                    <div id="segmentLength" className="accordion-collapse collapse show">
                                        <div className="input-group p-3">
                                            <input type="number" name="minSegmentLength" onChange={onChangeMinSegmentLength} onKeyDown={onKeydownMinSegmentLength} defaultValue={where?.segmentLength_gte} className="form-control" placeholder="Min" />
                                            <span className="input-group-text">to</span>
                                            <input type="number" name="maxSegmentLength" onChange={onChangeMaxSegmentLength} onKeyDown={onKeydownMaxSegmentLength} defaultValue={where?.segmentLength_lte} className="form-control" placeholder="Max  " />
                                        </div>
                                    </div>
                                </div> 
                                <button className="btn btn-outline-primary mb-3" type="button" onClick={handleResetFilter} >
                                    Reset Filters
                                </button> 
                            </div>
                        </div>
                    </div> 
                </div>
                <div className="flex-fill">
                    <div className="d-flex justify-content-between">
                        <div className="csv-download">
                            <CSVLink filename={"ensocean-domain-results.csv"} data={csvData} headers={csvHeaders} data-bs-toogle="tooltip" data-bs-title="Download CSV" className="btn btn-default" >
                                <img src={fileTypeCsv} alt= "" />
                            </CSVLink> 
                        </div>
                        
                        <div className="paging d-flex gap-2"> 
                            <button className={ data && data.domains && skip >= first ? "btn btn-outline-light text-dark": "btn btn-outline-light text-dark disabled" } onClick={(e)=> setSkip(skip - first) }>
                                {"<"} Prev
                            </button>  
                            <button className={ data && data.domains && data.domains.length >= first ? "btn btn-outline-light text-dark": "btn btn-outline-light text-dark disabled" } onClick={(e)=> setSkip(skip + first) }>
                                Next {">"}
                            </button> 
                        </div>

                        <div className="view-types d-flex gap-2">
                            <button type="button" className={view === "list" ? "btn btn-outline-light active": "btn btn-outline-light"} onClick={(e) => onClickView(e, "list")}>
                                <img src={listUl} alt= "" />
                            </button>  
                            <button type="button" className={view === "gallery" ? "btn btn-outline-light active": "btn btn-outline-light"} onClick={(e) => onClickView(e, "gallery")}>
                                <img src={gridFill} alt= "" />
                            </button>
                        </div> 
                    </div>
                    <div className="container-fluid p-0 mt-2" id="#results">
                        <FilterResults called={called} loading={loading} error={error} data={data} view={view} />
                    </div> 
                    <div className="d-flex justify-content-between mt-2">
                        <div className="csv-download">
                            <CSVLink filename={"ensocean-domain-results.csv"} data={csvData} headers={csvHeaders} data-bs-toogle="tooltip" data-bs-title="Download CSV" className="btn btn-default" >
                                <img src={fileTypeCsv} alt= "" />
                            </CSVLink> 
                        </div> 
                        <div className="paging d-flex gap-2"> 
                            <button className={ data && data.domains && skip >= first ? "btn btn-outline-light text-dark": "btn btn-outline-light text-dark disabled" } onClick={handlePagePrev}>
                                {"<"} Prev
                            </button>  
                            <button className={ data && data.domains && data.domains.length >= first ? "btn btn-outline-light text-dark": "btn btn-outline-light text-dark disabled" } onClick={handlePageNext}>
                                Next {">"}
                            </button> 
                        </div> 
                        <div className="view-types d-flex gap-2">
                            <button type="button" className={view === "list" ? "btn btn-outline-light active": "btn btn-outline-light"} onClick={(e) => onClickView(e, "list")}>
                                <img src={listUl} alt= "" />
                            </button>  
                            <button type="button" className={view === "gallery" ? "btn btn-outline-light active": "btn btn-outline-light"} onClick={(e) => onClickView(e, "gallery")}>
                                <img src={gridFill} alt= "" />
                            </button>
                        </div> 
                    </div>  
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
 
 
const FilterResults = ( { called, loading, error, data, view}) => {
    if(!called) return;
 
    if (loading)  {

        if(view === "list") {
            return ( 
            <>
            <div className='table-responsive placeholder-glow'>
                <table className='table table-hover'>
                    <thead className="table-light text-start">
                        <tr>
                            <th className="p-3">Name</th> 
                            <th className="p-3">Expires</th>
                            <th className="p-3">Owner</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-start"> 
                        {[...Array(10)].map((x, i) =>
                        <tr key={i}>
                            <td className="p-3"><span className="placeholder col-12"></span></td> 
                            <td className="p-3"><span className="placeholder col-8"></span></td>
                            <td className="p-3"><span className="placeholder col-8"></span></td>
                            <td className="p-3"><span className="placeholder col-4"></span></td>
                            <td className="p-3"><span className="placeholder col-4"></span></td>
                            <td className="p-3"><span className="placeholder col-6"></span></td>
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
                <div className="row g-2 placeholder-glow">
                    {[...Array(12)].map((x, i) =>
                    <div className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2" key={i}>
                        <div className="card h-100 text-start">
                            <div className="card-body p-0"> 
                                <span className="placeholder w-100" style={{minHeight: "167px"}}></span>
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
                <div className="table-responsive">
                    <table className='table table-hover'>
                        <thead className="table-light text-start">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Expires</th> 
                                <th className="p-3">Owner</th>
                                <th className="p-3">Created</th>
                                <th className="p-3">Registered</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-start">
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
                                            <div className="card h-100 text-start">
                                                <LazyLoadImage
                                                    alt={domain.name} 
                                                    className="img-fluid"
                                                    onError={(e)=> { e.target.src = notAvailable; }}
                                                    placeholder={<img src={spinner} className="img-fluid" />}
                                                    placeholderSrc={spinner}
                                                    visibleByDefault={false}
                                                    width={46}
                                                    height={46}
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
                <div className="row g-2">
                    {data.domains.length < 1 &&
                        <div className="col-12 text-center text-warning">No Result found</div>
                    } 
                    {data.domains.map((domain) => (
                    <div className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2" key={domain.id}>
                        <div className="card text-start"> 
                                <LazyLoadImage
                                    alt={domain.name} 
                                    className="img-fluid card-img-top" 
                                    onError={(e)=> { document.getElementById(domain.id)?.remove(); e.target.src = notAvailable; e.target.alt="Not available" }}
                                    afterLoad={(e)=> { document.getElementById(domain.id)?.remove(); }}
                                    src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label)) }
                                /> 
                                <img id={domain.id} src={spinner} className="img-fluid card-img-top" />
                            <div className="card-body p-2">
                                <h6 className="card-title m-0 text-truncate">
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
                                </h6>
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