import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate} from "react-router-dom";  
import { Menu, AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useLazyQuery, gql } from "@apollo/client";
import { getLabelHash, getLength, isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName } from '../helpers/String';
import { useCart } from "react-use-cart";
import { Check2 } from "react-bootstrap-icons";
import AddToCartButton from './AddToCartButton';
import ClaimNowButton from './ClaimNowButton';

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
    const { addItem, removeItem, inCart } = useCart();
      
    const getDefaultOptions = (q)=> {
        return [ { 
            id: getLabelHash(q), 
            label: q, 
            extension: "eth", 
            expires: null, 
            registered: null, 
            registrant: null, 
            duration: 1, 
            durationPeriod: "year", 
            available: false, 
            price: 0, 
            valid: isValidDomain(q) 
        } ];
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
                    return { 
                            id: domain.id, 
                            label: domain.label || item.label,  
                            extension: domain.extension, 
                            expires: domain.expires, 
                            available: false, 
                            registrant: domain.registrant, 
                            registered: domain.registered, 
                            duration: 1, 
                            durationPeriod: "year", 
                            price: 0, 
                            valid: isValidDomain(domain.label || item.label) 
                        }
                } else {
                    return { 
                        id: item.id, 
                        label: item.label,  
                        extension: "eth", 
                        expires: null, 
                        available: true, 
                        registrant: null, 
                        registered: null, 
                        duration: 1, 
                        durationPeriod: "year", 
                        price: 0,
                        valid: isValidDomain(item.label)
                    }
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
            delay={500} 
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
            renderMenu={(domains, menuProps) => ( 
                <Menu {...menuProps} >
                    {domains.map((domain, index) => (
                        <>
                        <div className='d-flex flex-column'>
                            <div key={domain.id} className="d-flex flex-row justify-content-between p-2 ps-3 pe-3 gap-1 fs-5 fw-bold">
                                <Link to={"/"+ domain.label + "."+ domain.extension} option={domain} position={index} className="text-truncate link-dark text-decoration-none">
                                {domain.label}.{domain.extension}
                                </Link> 
                                {(function(){
                                    if(loading) {
                                        return (<div className="spinner-border spinner-border-sm"></div>)
                                    }  else if(!domain.valid) {
                                        return (<span className="badge text-bg-danger">Invalid</span> )
                                    } else {
                                        if(!domain.available) {
                                            if (isPremium(domain.expires) ) { 
                                                return (<span className="badge text-bg-success">Premium</span>)
                                            } else if(isExpiring(domain.expires)) {
                                                return (<span className="badge text-bg-warning">Grace Period</span>)
                                            } else if(isExpired(domain.expires)) { 
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
                            <div className='d-flex flex-row justify-content-center align-items-center'>
                                {available && <ClaimNowButton domain={domain} /> }
                            </div>
                        </div>
                        </>
                    ))}
                    {error && <span className="badge text-bg-danger">There was a problem. Please try again.</span>}
                    {query.length < 3 && <div className="d-flex flex-row justify-content-center p-2 gap-1">Type 3 characters to search</div>}
                    {!loading && !available && isValid && getLength(query) > 2 && 
                        <div className="d-flex flex-row justify-content-between p-2 ps-3 pe-3 gap-1">
                            <Link to={"/find?q="+ query } className="text-truncate text-decoration-none text-center mx-auto"> 
                                Click to see more domains
                            </Link>
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
            registered
            created
            registrant
            owner
        }
    }
`;

export default AutoComplete;