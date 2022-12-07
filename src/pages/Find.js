import React, { useState, useRef, useEffect }  from "react"; 
import { useLocation, Link, useNavigate} from "react-router-dom";  
import {Helmet} from "react-helmet";
import { useLazyQuery, gql } from "@apollo/client";
import { getLabelHash, getLength, isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName, getTokenId, obscureLabel, isNonAscii} from '../helpers/String';
import ImageSmall from "../components/ImageSmall";
import DomainLink from "../components/DomainLink";
 
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
        }
    }
`;

const Find = () => { 
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const input = useRef();
    const [query, setQuery] = useState(null);
    const [options, setOptions] = useState([]);
    const [available, setAvailable] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [getDomains, { data, loading, error }] = useLazyQuery(GET_DOMAINS); 
    
    useEffect(()=> {
      const search = new URLSearchParams(location.search);
      let q = search.get("q") || "";
      setQuery(q); 
      q = q.toLowerCase().trim();
      setOptions([]);
      setQuery(q); 
       
      if(getLength(q) < 3) {
          setIsValid(false);
          setAvailable(false);
          return;
      } 

      if(q.lastIndexOf(".eth") !== -1) {
          q = q.substring(0, q.lastIndexOf(".eth"));
      }

      if(!isValidDomain(q)) {  
          setIsValid(false);
          setAvailable(false);  
          setOptions([ { id: getLabelHash(q), label: q,  extension: "eth", expires: null, available: false, valid: false } ]);
          return;
      } 

      let items = [ { id: getLabelHash(q), label: q, extension: "eth", expires: null, available: false, valid: isValidDomain(q) }]; 
      const labels = items.map(t=> t.id);

      getDomains({ variables: { labels }});

    }, [location])

    const handleSubmit = async (e) => { 
      e.preventDefault(); 
      navigateToDomain(input.current.value); 
      return false;
    }

    const navigateToDomain = (domain)=> {
        domain = normalizeName(domain);
        setQuery(domain);
        if(domain.lastIndexOf(".eth") !== -1)
            navigate("/"+ domain)
        else if( domain.lastIndexOf(".eth") === -1) {
            navigate("/find?q="+ domain);
        }
    }

    return (
        <>  
        <Helmet> 
              <title>Find Your Web3 Name - EnsOcean</title>
              <meta name="description" content="Find your next Ethereum Name Service (ENS) domain easily. Catch expired domains or get suggestions to find out." />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>Find Your Web3 Name</h1>
            </div> 
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 pt-3">
                <form onSubmit={handleSubmit}>
                  <div className="input-group input-group-lg">
                    <input ref={input} className="form-control" name="q" defaultValue={query} placeholder="Search for a Web3 username" />
                    <button className="btn btn-outline-primary">Search</button>
                  </div>
                </form>
             </div>
          </div>
          <div className="row">
            <div className="col-lg-12 pt-3">
              
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 pt-3">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h6 className='fs-5 m-1'>Suggestions</h6>
                </div>
                <ol className="list-group list-group-flush placeholder-glow">
                  { loading && 
                    <>
                        {[...Array(10)].map((x, i) =>
                        <li key={i} className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex">
                            <span className="placeholder col-4"></span>
                            <span className="placeholder col-2"></span>
                        </li>
                        )}
                    </>     
                  }

                  { !loading && error && 
                      <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-danger'>{error.message}</span></li>
                  }

                  { !loading && !error && data && data.domains.length < 1 &&
                      <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-muted'>No Result</span></li>
                  }

                  { !data &&
                      <li className="list-group-item p-3 fs-5 placeholder-glow justify-content-between d-flex"><span className='text-muted'>Type 3 characters or more</span></li>
                  }

                  { !loading && !error && data && data.domains.length > 0 &&
                    <> 
                        {data.domains.map((domain) => (
                        <li key={domain.id} className="list-group-item list-group-item-action p-3">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <div className="card text-start">
                                   <ImageSmall domain={domain} />
                                  </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                  <DomainLink domain={domain} />
                              </div>
                            </div> 
                        </li>
                      ))}
                    </>
                  }  
                </ol> 
              </div>
            </div>
          </div> 
        </div>
      </>
    );
};
  
export default Find;