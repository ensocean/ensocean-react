import React, { useState } from 'react';
import { Link, useNavigate} from "react-router-dom";  
import { Menu, AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useLazyQuery, gql } from "@apollo/client";  
import searchIcon from "../../assets/search.svg";
import { isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName } from '../../helpers/String';

//TODO: arkaya search ıcon
//TODO: multiple label list

const AutoComplete = () => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [available, setAvailable] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [activeClass, setActiveClass] = useState("is-search");
    const [searchDomains, { loading, error }] = useLazyQuery(DOMAIN_DETAILS); 
    const navigate = useNavigate(); 
     
    const handleSearch = async (q) => {
        setQuery(q); 
        setOptions([{id: null, label: q, extension: "eth" }]);

        if(q.length < 3) {
            setActiveClass("is-search");
            return;
        } 

        if(q.lastIndexOf(".eth") !== -1) {
            q = q.substring(0, q.lastIndexOf(".eth"));
        }

        if(!isValidDomain(q)) {
            setIsValid(false);
            setAvailable(false);  
            setActiveClass("is-invalid");
            return;
        } 
 
        const { data } = await searchDomains({ variables: { q }});
 
        if( data.domains.length > 0) { 
            setOptions(data.domains);
            setAvailable(false);
            setActiveClass("is-search")
        } else {
            setIsValid(true);
            setAvailable(true); 
            setActiveClass("is-valid");
        }    
    };

    const handleSubmit = (e) => {  
    navigateToDomain(query);
    e.preventDefault();
    return false;
    };

    const handleKeydown = (e) => {  
    if (e.key === "Enter") {
        navigateToDomain(e.target.value);
        e.preventDefault();
    }
    return false;
    };

    const navigateToDomain = (domain)=> {
    domain = normalizeName(domain);
    setQuery(domain);
    if(domain.lastIndexOf(".eth") !== -1)
        navigate("/"+ domain)
    else if( domain.lastIndexOf(".eth") === -1) {
        navigate("/find?label="+ domain);
    }
    }

    return (
        <AsyncTypeahead
            filterBy={()=> true}
            isLoading={false}
            clearButton={false}
            defaultOpen={false}
            useCache={false}
            id="auto_search"
            delay={400} 
            minLength={1}
            labelKey="label" 
            onSearch={handleSearch}
            onKeyDown={handleKeydown}
            options={options} 
            className="flex-grow-1"
            promptText="Type 3 character to search"
            searchText="Search"
            emptyLabel="Type 3 character to search"
            placeholder="Search for a web3 username"
            renderMenu={(results, menuProps) => (
            <Menu {...menuProps} >
                {results.map((result, index) => (
                <>
                <div key={result.id} className="d-flex flex-row justify-content-between p-2 ps-3 pe-3 gap-1 fs-6 fw-bold">
                    <Link to={"/"+ result.label + "."+ result.extension} option={result} position={index} className="text-truncate link-dark text-decoration-none">
                    {result.label}.{result.extension}
                    </Link> 
                    {(function(){
                        if(loading) {
                            return (<div className="spinner-border spinner-border-sm"></div>)
                        } else if(error) {
                            return (<span className="badge text-bg-danger">{error}</span> )
                        } else if(!isValid) {
                            return (<span className="badge text-bg-danger">Invalid</span> )
                        } else {
                            if(!available) {
                                if (isPremium(result.expires) ) {
                                    setAvailable(true);
                                    setActiveClass("is-valid");
                                    return (<span className="badge text-bg-success">Premium</span>)
                                } else if(isExpiring(result.expires)) {
                                    return (<span className="badge text-bg-warning">Grace Period</span>)
                                } else if(isExpired(result.expires)) {
                                    setAvailable(true);
                                    setActiveClass("is-valid");
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
                {!available && isValid &&
                    <div key="clickmore" className="d-flex flex-row justify-content-center p-2 gap-1">
                        <Link to={"/find?label="+ result.label } option={result} position={index} className="text-truncate link-dark text-decoration-none">
                            Click to see more domains...
                        </Link>
                    </div>
                }
                </>
                ))}
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


const DOMAIN_DETAILS = gql`
    query Domains( $q: String! ) {
        domains ( 
            where: {
                label: $q
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