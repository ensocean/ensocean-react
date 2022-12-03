import React, { useState } from 'react';
import { Link, useNavigate} from "react-router-dom";  
import { Menu, AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useLazyQuery, gql } from "@apollo/client";  
import searchIcon from "../../assets/search.svg";
import { isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName } from '../../helpers/String';
  
const AutoComplete = () => {
    const [query, setQuery] = useState("");
    const [options, setOptions] = useState([]);
    const [available, setAvailable] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [activeClass, setActiveClass] = useState("is-search");
    const [searchDomains, { loading, error }] = useLazyQuery(DOMAIN_DETAILS); 
    const navigate = useNavigate(); 
     
    const handleSearch = async (q) => {
       
        setOptions([]);
        setQuery(q.toLowerCase()); 
         
        if(Array.from(q).length < 3) {
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

        setIsValid(true);

        const labels = [q, "0x"+ q, "the"+ q]; 
        const options = labels.map(t=> { return { id: t, label: t,  extension: "eth", expires: null, valid: isValidDomain(t) } });
        setOptions(options);
 
        const { data } = await searchDomains({ variables: { labels }});
  
        if( data.domains.length > 0) { 
            const options = labels.map(label => { 
                let domain = data.domains.filter(n=> n.label === label)[0];
                if(domain) {
                    return { id: domain.id, label: domain.label,  extension: domain.extension, expires: domain.expires, available: false, valid: isValidDomain(domain.label) }
                } else {
                    return { id: label, label: label,  extension: "eth", expires: null, available: true, valid: isValidDomain(label) }
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
    navigateToDomain(query);
    e.preventDefault();
    return false;
    };
 
    const handleKeydown = (e) => {  
        if (e.key === "Enter") {
            navigateToDomain(e.target.value);
            //e.preventDefault();
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
            delay={200} 
            minLength={0}
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
            <>
            <Menu {...menuProps} >
                {results.map((result, index) => (
                <div key={result.id} className="d-flex flex-row justify-content-between p-2 ps-3 pe-3 gap-1 fs-6 fw-bold">
                    <Link to={"/"+ result.label + "."+ result.extension} option={result} position={index} className="text-truncate link-dark text-decoration-none">
                    {result.label}.{result.extension}
                    </Link> 
                    {(function(){
                        if(loading) {
                            return (<div className="spinner-border spinner-border-sm"></div>)
                        } else if(error) {
                            return (<span className="badge text-bg-danger">{error}</span> )
                        } else if(!result.valid) {
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
                {query.length < 3 && <div className="d-flex flex-row justify-content-center p-2 gap-1">Type 3 characters to search</div>}
                {!available && isValid && query.length > 2 &&
                    <div className="d-flex flex-row justify-content-center p-2 gap-1">
                        <Link to={"/find?label="+ query } className="text-truncate link-dark text-decoration-none">
                            Click to see more domains...
                        </Link>
                    </div>
                }
            </Menu> 
            </>
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
    query Domains( $labels: [String] ) {
        domains ( 
            where: {
                label_in: $labels
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