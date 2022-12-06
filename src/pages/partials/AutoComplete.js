import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate} from "react-router-dom";  
import { Menu, AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useLazyQuery, gql } from "@apollo/client";
import { getLabelHash, getLength, isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName } from '../../helpers/String';
  
const AutoComplete = () => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [available, setAvailable] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [activeClass, setActiveClass] = useState("is-search");
    const [getDomains, { loading, error }] = useLazyQuery(GET_DOMAINS); 
    const location = useLocation();
    const navigate = useNavigate(); 
    const input = useRef();
      
    const getDefaultOptions = (q)=> {
        return [ { id: getLabelHash(q), label: q, extension: "eth", expires: null, available: false, valid: isValidDomain(q) }, 
            { id: getLabelHash("0x"+ q), label: "0x"+ q, extension: "eth", expires: null, available: false, valid: isValidDomain("0x"+ q) }, 
            { id: getLabelHash("the"+ q), label: "the"+ q, extension: "eth", expires: null, available: false, valid: isValidDomain("the"+ q) } 
        ];
    }

    const handleSearch = async (q) => {
        q = q.toLowerCase().trim();
        setOptions([]);
        setQuery(q);
         
        if(getLength(q) < 3) {
            setIsValid(false);
            setAvailable(false);  
            setActiveClass("is-search");
            return;
        } 

        if(q.lastIndexOf(".eth") !== -1) {
            q = q.substring(0, q.lastIndexOf(".eth"));
        }

        let options = getDefaultOptions(q);
 
        if(!isValidDomain(q)) {  
            setIsValid(false);
            setAvailable(false);  
            setActiveClass("is-invalid"); 
            setOptions(options);
            return;
        } 
   
        const labels = options.map(t=> t.id);
        
        setIsValid(true);
        setOptions(options);

        const { data } = await getDomains({ variables: { labels }});
  
        if( data.domains.length > 0) { 
            options = options.map(item => { 
                let domain = data.domains.filter(n=> n.id === item.id)[0];
                if(domain) {
                    return { id: domain.id, label: domain.label || item.label,  extension: domain.extension, expires: domain.expires, available: false, valid: isValidDomain(domain.label || item.label) }
                } else {
                    return { id: item.id, label: item.label,  extension: "eth", expires: null, available: true, valid: isValidDomain(item.label) }
                }
            }); 
            setOptions(options);
            setAvailable(false); 
            setActiveClass("is-search");
        } else {  
            setAvailable(true); 
            setActiveClass("is-valid");
        }    
    };

    const handleSubmit = (e) => {  
        e.preventDefault();
        navigateToDomain(query); 
        return false;
    };
 
    const handleKeydown = (e) => {   
        if (e.key === "Enter") {
            e.preventDefault(); 
            navigateToDomain(e.target.value);
        }
        return false;
    };

    const navigateToDomain = (q)=> { 
        if(!isValidName(q)) return;
        q = normalizeName(q);

        setQuery(q);
        if(q.lastIndexOf(".eth") !== -1) {
            navigate("/"+ q)
        } else {
            navigate("/find?q="+ q);
        }
        input.current.clear();
    }

    return (
        <AsyncTypeahead
            ref={input}
            filterBy={()=> true}
            isLoading={false}
            clearButton={false}
            defaultOpen={false}
            useCache={false}
            id="auto_search"
            delay={200} 
            minLength={0}
            labelKey="q" 
            onSearch={handleSearch}
            onKeyDown={handleKeydown} 
            options={options} 
            defaultInputValue={query}
            className="flex-grow-1"
            promptText="Type 3 character to search"
            searchText="Search"
            emptyLabel="Type 3 character to search"
            placeholder="Search for a web3 username"
            renderMenu={(results, menuProps) => ( 
                <Menu {...menuProps} >
                    {results.map((result, index) => (
                    <div key={result.id} className="d-flex flex-row justify-content-between p-2 ps-3 pe-3 gap-1 fs-6 fw-bold">
                        <Link to={"/"+ result.label + "."+ result.extension} option={result} position={index} className="text-truncate link-dark text-decoration-none">
                        {result.label}.{result.extension}
                        </Link> 
                        {(function(){
                            if(loading) {
                                return (<div className="spinner-border spinner-border-sm"></div>)
                            }  else if(!result.valid) {
                                return (<span className="badge text-bg-danger">Invalid</span> )
                            } else {
                                if(!result.available) {
                                    if (isPremium(result.expires) ) { 
                                        return (<span className="badge text-bg-success">Premium</span>)
                                    } else if(isExpiring(result.expires)) {
                                        return (<span className="badge text-bg-warning">Grace Period</span>)
                                    } else if(isExpired(result.expires)) { 
                                        return (<span className="badge text-bg-success">Available</span>)
                                    } else {
                                        return (<span className="badge text-bg-secondary">Not Available</span>)
                                    }
                                } else {
                                    return (<span className="badge text-bg-success">Available</span>)
                                }
                            } 
                        })()} 
                    </div> 
                    ))}
                    {error && <span className="badge text-bg-danger">There was a problem. Please try again.</span>}
                    {query.length < 3 && <div className="d-flex flex-row justify-content-center p-2 gap-1">Type 3 characters to search</div>}
                    {!available && isValid && getLength(query) > 2 && 
                        <div className="d-flex flex-row justify-content-between p-2 ps-3 pe-3 gap-1 fs-6 fw-bold">
                            <Link to={"/find?q="+ query } className="text-truncate link-dark text-decoration-none text-center mx-auto"> Click to see more domains... </Link>
                    </div>}
                </Menu>  
            )}
            renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                return (
                    <form role="search" onSubmit={handleSubmit}>
                        <div className="input-group input-group-lg form-group has-validation ">
                            <input {...inputProps} 
                                className={"form-control pe-2 border-primary " + activeClass }
                                ref={(node) => {
                                inputRef(node);
                                referenceElementRef(node);
                                }} /> 
                        </div> 
                    </form> 
                );
            }}
        />
    );
};


const GET_DOMAINS = gql`
    query Domains( $labels: [String] ) {
        domains ( 
            where: {
                id_in: $labels
            }
        )
        {
            id
            label
            extension
            expires
        }
    }
`;

export default AutoComplete;