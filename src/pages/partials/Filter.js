import React, {useState, useEffect } from "react"; 
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getExpires, getTimeAgo, jsonParse, jsonStringify, getTokenId } from '../../helpers/String';
import { useLazyQuery, gql } from '@apollo/client'; 
import { CSVLink } from "react-csv";  
import OwnerLink from "../../components/OwnerLink";
import DomainCardInline from "../../components/DomainCardInline";
import DomainCard from "../../components/DomainCard"; 
import { DelayInput } from "react-delay-input";
import { ArrowRepeat, ArrowUp, FiletypeCsv, FunnelFill, GridFill, ListUl, Search, SortDown, SortUp } from "react-bootstrap-icons";
import { Offcanvas, Spinner } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const DEBOUNCE_INTERVAL = 500; 
 
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
    "include-arabic",
    "palindrome"
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
    let _filterShow = localStorage.getItem("filterShow") || false;  
 
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
    const [filterShow, setFilterShow] = useState(false);

    const handleFilterClose = () => setFilterShow(false);
    const handleFilterShow = () => setFilterShow(true);
 
     
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
        setFilterShow(!filterShow);

        const elem = document.getElementById("filters");
        if(elem.classList.contains("d-none")) {
            elem.classList.add("d-block")
            elem.classList.remove("d-none")
            localStorage.setItem("filterShow", true); 
        } else { 
            elem.classList.remove("d-block") 
            elem.classList.add("d-none")
            localStorage.setItem("filterShow", false); 
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
        if(value === null || value === undefined || value === "" || value === "0" || Number(value) < 1) { 
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
        changeFilter(e.target.value, "label_contains_nocase");
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
                        <button className="btn btn-outline-light rounded-0 border position-relative"  type="button" onClick={handleFilterClick}>
                            <FunnelFill className="text-dark" />
                            {filterCount > 0 && 
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {filterCount}
                                    <span className="visually-hidden">selected filters</span>
                                </span>
                            }
                        </button>
                        <button className="btn btn-outline-light rounded-0 border" disabled={loading?"disabled": ""} type="button" onClick={handleRefreshClick}>
                            {loading ? <Spinner animation="border" variant="dark" size="sm" /> : <ArrowRepeat  className="text-dark" /> }
                        </button>
                        <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light border-end-0 rounded-0">
                                <Search className="text-dark" />
                            </span>
                            <DelayInput minLength={1} delayTimeout={300} className={"form-control border-start-0 rounded-0"} name="searchText" onChange={onChangeSearch} onKeyDown={onKeydownSearch} value={where?.label_contains_nocase} placeholder="Search Name" />
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
                            <SortUp className="text-dark" />
                        </button>
                    }
                    {orderDirection === "asc" &&
                        <button className="btn btn-outline-light rounded-0 border" type="button"  onClick={handleOrderDirection} >
                            <SortDown className="text-dark" />
                        </button>
                    }
                </div>
            </div> 
        </div> 
        <div className="d-flex flex-row align-items-start"> 
            <div id="filters" className={"flex-shrink-0 sticky-lg-top mt-3 "+ (_filterShow === "true" ? "d-block": "d-none")}  style={{ maxWidth: 350 }}>
                <Offcanvas show={filterShow} onHide={handleFilterClose} responsive="lg" placement="start" className="me-3" style={{  }}>
                    <Offcanvas.Header closeButton>
                        <span className="fw-bold fs-6">Filter</span>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="p-0 m-0 overflow-scroll">
                        <div className="card">
                            <div className="card-body p-1">
                            <div className="accordion"> 
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
                                <div className="d-flex flex-row justify-content-between p-2 gap-2">
                                    <button className="btn btn-outline-primary" type="button" onClick={handleResetFilter} >
                                        Reset Filters
                                    </button>
                                    <button className="btn btn-primary" type="button" onClick={handleFilterClose}>
                                        Done
                                    </button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            <div className="container-fluid p-0">
                <div className="d-flex justify-content-between mt-2">
                {data && data.domains.length > 1 &&
                    <>
                        <div className="csv-download">
                            <CSVLink filename={"ensocean-domain-results.csv"} data={csvData} headers={csvHeaders} data-bs-toogle="tooltip" data-bs-title="Download CSV" className="btn btn-default" >
                                <FiletypeCsv className="text-dark" />
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
                                <ListUl className="text-dark" />
                            </button>  
                            <button type="button" className={view === "gallery" ? "btn btn-outline-light active": "btn btn-outline-light"} onClick={(e) => onClickView(e, "gallery")}>
                                <GridFill  className="text-dark" />
                            </button>
                        </div> 
                    </>
                }
                </div>
                <div className="container-fluid p-1" id="#results">
                    <FilterResults called={called} loading={loading} error={error} data={data} view={view} />
                </div> 
                <div className="d-flex justify-content-between">
                    {data && data.domains.length > 1 &&
                    <>
                        <div className="csv-download">
                            <CSVLink filename={"ensocean-domain-results.csv"} data={csvData} headers={csvHeaders} data-bs-toogle="tooltip" data-bs-title="Download CSV" className="btn btn-default" >
                                <FiletypeCsv className="text-dark" />
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
                                <ListUl className="text-dark" />
                            </button>  
                            <button type="button" className={view === "gallery" ? "btn btn-outline-light active": "btn btn-outline-light"} onClick={(e) => onClickView(e, "gallery")}>
                                <GridFill className="text-dark" />
                            </button>
                        </div>
                    </>
                    }
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
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 row-cols-xl-4 row-cols-xxl-5 row-cols-xxxl-6">
                 <DomainCard loading={loading} />
                </div>
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
                {data && data.domains.length < 1 &&
                    <div className="alert alert-light text-center"> No Result Found</div>
                }
                {data && data.domains.length > 1 &&
                <div className="table-responsive">
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
                            {data &&
                                <>
                                    {data.domains.map((domain) => (
                                    <tr key={domain.id} className="t-card">
                                        <td className="p-3">
                                            <DomainCardInline domain={domain} />
                                        </td> 
                                        <td className="p-3"> 
                                            {getExpires(domain.expires)}
                                        </td>
                                        <td className="p-3"> 
                                            <OwnerLink owner={domain.owner} />
                                        </td>
                                        <td className="p-3">{getTimeAgo(domain.created)}</td>
                                        <td className="p-3">{getTimeAgo(domain.registered)}</td> 
                                    </tr>
                                    ))}
                                </>
                            }
                        </tbody>
                    </table>
                </div>
                }
                </>
            )
        } else {
            return (
            <> 
                {data && data.domains.length < 1 &&
                    <div className="alert alert-light text-center">No Result found</div>
                } 
                {data && 
                <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-4 row-cols-xl-4 row-cols-xxl-5 row-cols-xxxl-6">
                        <>
                        {data.domains.map((domain) => (
                        <div className="col mb-3 p-1" key={domain.id}>
                            <DomainCard domain={domain} />
                        </div> 
                        ))}
                        </> 
                </div>  
                }
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
            owner {
                id
                primaryName
            }
            registrant {
                id
                primaryName
            }
            length
            extension
            segmentLength
            tags
            extension
        }
    }`;
}
 
export default Filter;