import React, { useState, useRef, useEffect }  from "react"; 
import { useLocation, Link, useNavigate} from "react-router-dom";  
import {Helmet} from "react-helmet";
import { useLazyQuery, gql } from "@apollo/client";
import { getLabelHash, getLength, isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName, getTokenId, obscureLabel, isNonAscii, getDateSimple, obscureAddress, getExpires, getDateString} from '../helpers/String';
import ImageSmall from "../components/ImageSmall";
import DomainLink from "../components/DomainLink";
import AddToCartButton from "../components/AddToCartButton";
import ClaimNowButton from "../components/ClaimNowButton";
import { useCart } from "react-use-cart";
import ViewYourCartButton from "../components/ViewYourCartButton";

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
            owner
            registrant
        }
    }
`;

const Find = () => { 
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const input = useRef();
    const [query, setQuery] = useState(null); 
    const [domain, setDomain] = useState(null); 
    const [options, setOptions] = useState(null); 
    const [available, setAvailable] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [activeClass, setActiveClass] = useState("is-search");
    const [getDomains, { loading, error }] = useLazyQuery(GET_DOMAINS); 
    const { addItem, removeItem, inCart } = useCart();
     
    useEffect(()=> {
      const search = new URLSearchParams(location.search);
      let q = search.get("q") || "";
      handleSearch(q); 
    }, [location]);

    const handleSearch = async (q) => {
       
      q = q.toLowerCase().trim(); 
      setQuery(q); 
      setActiveClass("is-search");
       
      if(getLength(q) < 3) {
          setIsValid(false);
          setAvailable(false);
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

      let options = [ { id: getLabelHash(q), label: q, extension: "eth", expires: null, price: 0, available: false, valid: isValidDomain(q) }]; 
      const labels = options.map(t=> t.id);

      const { data } = await getDomains({ variables: { labels }});
      
      if(data && data.domains.length > 0) {
        options = options.map(item => { 
          let domain = data.domains.filter(n=> n.id === item.id)[0];
          if(domain) {
              return { 
                      id: domain.id, label: domain.label || item.label, 
                      extension: domain.extension, 
                      expires: domain.expires, 
                      registered: domain.registered, 
                      registrant: domain.registrant, 
                      owner: domain.owner, 
                      available: false, 
                      price: 0, 
                      valid: isValidDomain(domain.label || item.label),
                      duration: 1,
                      durationPeriod: "year"
                    }
              
          } else {
              return { 
                      id: item.id, 
                      label: item.label,  
                      extension: "eth", 
                      expires: null, 
                      registered: null, 
                      registrant: null, 
                      owner: null, 
                      available: true, 
                      price: 0, 
                      valid: isValidDomain(item.label),
                      duration: 1,
                      durationPeriod: "year"
                    }
          }
        }); 
 
        setOptions(options)
        let domain = options[0];

        if(isExpired(domain.expires)) {
          setAvailable(true);
          setActiveClass("is-search");
        } else if(isExpiring(domain.expires)) {
          setAvailable(false);
          setActiveClass("has-warning");
        }else if(isPremium(domain.expires)) {
          setAvailable(true);
          setActiveClass("is-valid");
        } else {
          setAvailable(false);
          setActiveClass("is-search");
        }
        
      } else {
        setOptions(options);
        setAvailable(true);
        setActiveClass("is-valid");
      }
    }

    const handleSubmit = async (e) => { 
      e.preventDefault();  
      if(!isValidName(input.current.value)) {
        setActiveClass("is-invalid");
        return;
      }
      const domain = normalizeName(input.current.value);
      navigate("/find?q="+ domain);
      return false;
    }

    const handleChange = (e) => {   
      e.preventDefault(); 
      setActiveClass("is-search");
      return false;
    };
  
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
                  <div className="input-group input-group-lg form-group has-validation">
                    <input ref={input} className={"form-control "+ activeClass} name="q" onChange={handleChange} defaultValue={query} placeholder="Search for a Web3 username" />
                  </div>
                </form>
             </div>
          </div>
          <div className="row">
            <div className="col-lg-12 pt-3"> 
              {loading && 
               <div className={"d-flex flex-row justify-content-between placeholder-glow"}>
                  <div className="flex-shrink-0"> 
                  {<span className="placeholder" style={{ width: 75, height: 75 }}></span>}
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="dflex flex-column">
                      <div>
                      <span className="placeholder col-12"></span>
                      </div>
                      <div>
                      <span className="placeholder col-6"></span>
                      </div>
                    </div>
                  </div>
               </div>
              }
              {!query && <span className="text-muted">Type 3 charcters or more to search.</span>}
              {!loading && query && options && options.length > 0 &&        
                <div className={"d-flex flex-row justify-content-between placeholder-glow "+ (available || isExpired(options[0].expires) || isPremium(options[0].expires) ? "border-success" : "") }>
                  <div className="flex-shrink-0">  
                    <div className="card">
                      <ImageSmall width={75} height={75} domain={options[0]} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="dflex flex-column">
                      <div>  
                        <DomainLink domain={options[0]} />
                      </div> 
                      {(available || (isExpired(options[0].expires) || isPremium(options[0].expires))) && 
                      <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-3"> 
                        <AddToCartButton domain={options[0]} />
                        {!inCart(options[0].id) && <ClaimNowButton domain={options[0]} />}
                        {inCart(options[0].id) && <ViewYourCartButton domain={options[0]} />}
                      </div>
                      }
                      {!available && options && !isExpired(options[0].expires) && !isPremium(options[0].expires) && 
                      <div className="mt-3 text-muted">  
                          Expires {getExpires(options[0].expires)}
                      </div>
                      }
                    </div>
                  </div>
                </div>  
              }
            </div> 
          </div>
        </div>
      </>
    );
};
  
export default Find;