import React, {useState, useEffect } from "react"; 
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getExpires, getTimeAgo, isExpired, isExpiring, isPremium, isValidName, jsonParse, jsonStringify, obscureAddress, obscureLabel, getTokenId, getDateString } from '../../helpers/String';
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
import ImageSmall from "../../components/ImageSmall";
import DomainLink from "../../components/DomainLink";
import OwnerLink from "../../components/OwnerLink";
import DomainCardInline from "../../components/DomainCardInline";
  
const DEBOUNCE_INTERVAL = 500;
const ENS_REGISTRAR_ADDRESS = process.env.REACT_APP_ENS_REGISTRAR_ADDRESS; 
const ENS_IMAGE_URL = process.env.REACT_APP_ENS_IMAGE_URL;
 
let timeout;

let csvHeaders = [
    { label: "Label", key: "label" },
    { label: "Extension", key: "extension" },
    { label: "Token ID", key: "tokenId" },
    { label: "Hash", key: "id" },
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
    "include-emoji", 
    "include-arabic"
];
 
const Filter = ({Tab, First, Skip, OrderBy, OrderDirection, Where, View}) => { 

    let location = useLocation(); 
    let navigate = useNavigate(); 
     
    const _search = location.search;
    let _query = new URLSearchParams(_search);
    let _tab = _query.get("tab") || Tab;
    let _first = Number(_query.get("first") || First);
    let _skip = Number(_query.get("skip") || Skip);
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
         _first = Number(_query.get("first") || First);
         _skip = Number(_query.get("skip") || Skip);
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
        e.preventDefault();
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
        if(value === null || value === undefined || value === "" || value === "0" || value < 1) { 
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
        let nextSkip = Number(skip - first);
        let _query = new URLSearchParams(location.search)
        _query.set("skip", nextSkip); 
        setSkip(nextSkip);
        navigate(location.pathname + "?"+ _query.toString());
    }

    const handlePageNext = (e) => { 
        let nextSkip = Number(skip + first);
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
        <div className="d-flex flex-lg-row flex-column justify-content-between gap-2 pt-2"> 
            <div className="flex-fill"> 
                <div className="flex-grow-1"> 
                    <div className="d-flex flex-row gap-2">
                        <button className="btn btn-outline-light rounded-0 border position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#offCanvasFilter" aria-controls="offcanvasNavbar" >
                            <img src={funnelFill} alt= ""  />
                            {filterCount > 0 && 
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {filterCount}
                                    <span className="visually-hidden">selected filters</span>
                                </span>
                            }
                        </button>
                        <button className="btn btn-outline-light rounded-0 border" type="button" onClick={handleRefreshClick}>
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
                <div className="input-group input-group-lg gap-2 rounded-0">
                    <select className="form-select rounded-0" onChange={handleOrderBy} value={orderBy}>
                        <option value="expires">Expiration</option>
                        <option value="registered">Registration</option>
                        <option value="created">Creation</option>
                        <option value="label">Name</option>
                        <option value="length">Length</option>
                    </select>
                    {orderDirection === "desc" &&
                        <button className="btn btn-outline-light rounded-0 border" type="button"  onClick={handleOrderDirection} >
                            <img src={sortUp} alt= ""  />
                        </button>
                    }
                    {orderDirection === "asc" &&
                        <button className="btn btn-outline-light rounded-0 border" type="button"  onClick={handleOrderDirection} >
                            <img src={sortDown} alt= ""  />
                        </button>
                    }
                </div>
            </div> 
        </div> 
        <div className="d-flex flex-column flex-lg-row align-items-start pt-2"> 
            <div className="offcanvas-xxl offcanvas-start sticky-xxl-top me-3" data-bs-scroll="true" data-bs-backdrop="true" id="offCanvasFilter" aria-labelledby="offCanvasFilterLabel">
                <div className="offcanvas-body p-0 m-0"> 
                    <div className="accordion w-100 card">
                        <div className="card-header border-0 d-flex flex-row justify-content-between p-3">
                            <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Filter</h5> 
                            <button type="button" class="btn-close d-block d-xxl-none" data-bs-dismiss="offcanvas" data-bs-target="#offCanvasFilter" aria-label="Close"></button>
                        </div>
                        <div className="accordion-item border-0 rounded-0">
                            <button className="accordion-button rounded-0 bg-white ps-3" type="button" data-bs-toggle="collapse" data-bs-target="#charSet">
                                <h6 className="accordion-header fw-bold text-dark">Character Set</h6>
                            </button> 
                            <div id="charSet" className="accordion-collapse collapse show text-muted p-3 overflow-scroll" style={{height: "240px"}}>
                                {defaultTags.map((t) =>
                                    <div key={t} className="input-group p-2 d-flex flex-row justify-content-between align-items-between">
                                        <label htmlFor={t} className="cursor-pointer">{t}</label>
                                        <input name="tags" className="form-check-input rounded-0" type="checkbox" id={t} value={t} onChange={onChangeTag} />
                                    </div>
                                )} 
                            </div>
                        </div>
                        <div className="accordion-item border-0 rounded-0">
                            <button className="accordion-button rounded-0 bg-white ps-3" type="button" data-bs-toggle="collapse" data-bs-target="#startsWith">
                                <h6 className="accordion-header fw-bold text-dark">Starts/Ends With</h6>
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
                            <button className="accordion-button rounded-0 bg-white ps-3" type="button" data-bs-toggle="collapse" data-bs-target="#length" >
                                <h6 className="accordion-header fw-bold text-dark">Length</h6>
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
                            <button className="accordion-button border-0 bg-white ps-3" type="button" data-bs-toggle="collapse" data-bs-target="#segmentLength" >
                                <h6 className="accordion-header fw-bold text-dark">Segment Length</h6>
                            </button> 
                            <div id="segmentLength" className="accordion-collapse collapse show">
                                <div className="input-group p-3">
                                    <input type="number" name="minSegmentLength" onChange={onChangeMinSegmentLength} onKeyDown={onKeydownMinSegmentLength} defaultValue={where?.segmentLength_gte} className="form-control" placeholder="Min" />
                                    <span className="input-group-text">to</span>
                                    <input type="number" name="maxSegmentLength" onChange={onChangeMaxSegmentLength} onKeyDown={onKeydownMaxSegmentLength} defaultValue={where?.segmentLength_lte} className="form-control" placeholder="Max  " />
                                </div>
                            </div>
                        </div> 
                        <div className="d-flex flex-row justify-content-between p-2">
                            <button className="btn btn-outline-primary" type="button" onClick={handleResetFilter} >
                                Reset Filters
                            </button>
                            <button className="btn btn-primary" type="button" data-bs-dismiss="offcanvas" data-bs-target="#offCanvasFilter">
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-grow-1 w-100">
                <div className="container-fluid d-flex justify-content-between p-0">
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
                <div className="container-fluid p-0 mt-2 mb-2" id="#results">
                    <FilterResults called={called} loading={loading} error={error} data={data} view={view} />
                </div> 
                <div className="container-fluid d-flex justify-content-between p-0">
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
        </>
    );
};
 
const FilterResults = ( { called, loading, error, data, view}) => {
    if(!called) return;
 
    if (loading)  {

        if(view === "list") {
            return ( 
            <>
            <div className='w-100 table-responsive placeholder-glow'>
                <table className='table table-hover'>
                    <thead className="table-light text-start">
                        <tr>
                            <th className="p-3">Name</th> 
                            <th className="p-3">Expires</th>
                            <th className="p-3">Owner</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Registered</th> 
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
                <div className="w-100 table-responsive">
                    <table className='table table-hover'>
                        <thead className="table-light text-start">
                            <tr>
                                <th className="p-3">Name</th>
                                <th className="p-3">Expires</th> 
                                <th className="p-3">Owner</th>
                                <th className="p-3">Created</th>
                                <th className="p-3">Registered</th> 
                            </tr>
                        </thead>
                        <tbody className="text-start">
                            {data.domains.length < 1 &&
                                <tr>
                                    <td colSpan='6' className='p-3 text-center'><span className='text-warning'>No Result</span></td>
                                </tr>
                            } 
                            {data.domains.map((domain) => (
                            <tr key={domain.id} className="t-card">
                                <td className="p-3">
                                    <DomainCardInline domain={domain} showRegistered={false} showNotAvailable={false} />
                                </td> 
                                <td className="p-3"> 
                                    {getExpires(domain.expires)}
                                </td>
                                <td className="p-3"> 
                                    <OwnerLink domain={domain} />
                                </td>
                                <td className="p-3">{getTimeAgo(domain.created)}</td>
                                <td className="p-3">{getTimeAgo(domain.registered)}</td> 
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
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-mdl-4 row-cols-lg-5 row-cols-mlg-5 row-cols-xl-6">
                    {data.domains.length < 1 &&
                        <div className="col text-center text-warning">No Result found</div>
                    } 
                    {data.domains.map((domain) => (
                    <div className="col mb-3" key={domain.id}>
                        <Link className="text-decoration-none link-dark fw-bold fs-5" title={"View "+ domain.label + "." + domain.extension +" on EnsOcean"} to={"/"+ encodeURIComponent(domain.label) + "."+ domain.extension }>
                            <div className="card text-start g-card"> 
                                <LazyLoadImage
                                    alt={domain.label} 
                                    className="img-fluid card-img-top" 
                                    onError={(e)=> { document.getElementById(domain.id)?.remove(); e.target.src = notAvailable; e.target.alt="Not available" }}
                                    afterLoad={(e)=> { document.getElementById(domain.id)?.remove(); }}
                                    src={ENS_IMAGE_URL.replace("{REACT_APP_ENS_REGISTRAR_ADDRESS}", ENS_REGISTRAR_ADDRESS).replace("{TOKEN_ID}", getTokenId(domain.label)) }
                                /> 
                                <img id={domain.id} src={spinner} className="img-fluid card-img-top" alt="" />
                                <div className="card-body p-2">
                                    <h6 className="card-title m-0 text-truncate fs-5 fw-bold">
                                        {obscureLabel(domain.label, 20)}.{domain.extension}
                                        {' '}
                                        { (domain.tags.includes("include-unicode") || domain.tags.includes("only-unicode")) && 
                                            <span data-bs-toogle="tooltip" data-bs-title="Include unicode characters">
                                                <img src={exclamationTriangleFill} alt= "" />
                                            </span>
                                        }
                                        {' '}
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
                                            return (<small className="text-success">Available in Premium</small>)
                                            } else if(isExpiring(domain.expires)) {
                                            return (<small className="text-warning"> In grace period</small>)
                                            } else if(isExpired(domain.expires)) {
                                            return (<small className="text-success"> AVAILABLE </small>)
                                            } else {
                                                return (<small className="text-muted"> Expires {  getExpires(domain.expires, false) } </small>)
                                            }
                                        })()} 
                                    </small>
                                </div>
                            </div>
                        </Link>
                    </div>
                    ))}
                </div>  
            </>
            ) 
        } 
    }  
}

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
            created
            registered
            expires
            owner
            registrant,
            length
            extension
            segmentLength
            tags
            extension
        }
    }`;
}
 
export default Filter;