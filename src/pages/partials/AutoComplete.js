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
  const [searchDomains, { loading, error }] = useLazyQuery(DOMAIN_DETAILS); 
  const navigate = useNavigate(); 
    
  const handleSearch = async (q) => {
    setAvailable(false);
    setQuery(q);
    setOptions([]);

    if(q.length < 3) return;

    if(q.lastIndexOf(".eth") !== -1) {
        q = q.substring(0, q.lastIndexOf(".eth"));
    }

    if(!isValidDomain(q)) {
        setIsValid(false);
        setOptions([{id: null, label: q, extension: "eth" }]);
        return;
    } 

    setIsValid(true);
    setOptions([{id: null, label: q, extension: "eth" }]);
 
    const {data} = await searchDomains({ variables: { q }})
    if( data.domains.length > 0) { 
        const domain = data.domains[0];
        if (isPremium(domain.expires) ) {
            setAvailable(true);
        } else if(isExpiring(domain.expires)) {
            setAvailable(false);
        } else if(isExpired(domain.expires)) {
            setAvailable(true);
        } else {
            setAvailable(false);
        }
    } else {
        setAvailable(true);
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
      delay={200}
      newSelectionPrefix={""}
      paginationText={""}
      labelKey="label"
      minLength={1}
      onSearch={handleSearch}
      options={options} 
      className="flex-grow-1"
      promptText="Type 3 character to search"
      searchText="Search"
      emptyLabel="Type 3 character to search"
      placeholder="Search for a web3 username"
      onKeyDown={handleKeydown}
      renderMenuItemChildren={(option)=> {
        return (<></>)
      }}
      renderMenu={(results, menuProps) => (
        <Menu {...menuProps} >
          {results.map((result, index) => (
            <>
            <div key={result.id} className="d-flex flex-row justify-content-between p-2 gap-1 fs-6 fw-bold">
                <Link to={"/"+ result.label + "."+ result.extension} option={result} position={index} className="text-truncate link-dark text-decoration-none">
                {result.label}.{result.extension}
                </Link>
                {loading && 
                <div className="spinner-border spinner-border-sm"></div>
                } 
                {!loading && isValid && available &&
                <span className="badge text-bg-success">Available</span>
                }
                {!loading && isValid && !available &&
                <span className="badge text-bg-secondary">Not Available</span>
                }
                {!isValid &&
                <span className="badge text-bg-danger">Not Valid</span>
                }
                {error &&
                <span className="badge text-bg-danger">Failed to load</span>
                }
            </div>
            {!available &&
                <div key="clickmore" className="d-flex flex-row justify-content-center p-2 gap-1">
                    <Link to={"/find?label="+ result.label } option={result} position={index} className="text-truncate link-dark text-decoration-none">
                        Click to see more item...
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
                <div className="input-group input-group-lg has-validation">
                    <input {...inputProps}
                        className={"form-control pe-0 " + (available && query.length > 2 ? "is-valid": "" ) + " " + (!isValid ? "is-invalid": "" ) }
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