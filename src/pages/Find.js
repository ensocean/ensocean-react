import React, { useState, useRef, useEffect }  from "react"; 
import { useLocation, useNavigate} from "react-router-dom";  
import { Helmet } from "react-helmet-async";
import { useLazyQuery, gql } from "@apollo/client";
import { getLabelHash, getLength, isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName, getExpires, getDateString, isAvailable} from '../helpers/String';
import AddToCartButton from "../components/AddToCartButton";
import ClaimNowButton from "../components/ClaimNowButton";
import { useCart } from "react-use-cart";
import ViewYourCartButton from "../components/ViewYourCartButton"; 
import { Search } from "react-bootstrap-icons";
import { Spinner } from "react-bootstrap";
import { DelayInput } from "react-delay-input";

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
    const [activeClass, setActiveClass] = useState("");
    const [getDomains, { loading, error }] = useLazyQuery(GET_DOMAINS); 
    const {  inCart } = useCart();
     
    useEffect(()=> {
      const search = new URLSearchParams(location.search);
      let q = search.get("q") || "";
      handleSearch(q); 
    }, [location]);

    const handleSearch = async (q) => {
       
      q = q.toLowerCase().trim(); 
      setQuery(q); 
      setActiveClass("");
       
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
          setActiveClass("is-valid");
        } else if(isExpiring(domain.expires)) {
          setAvailable(false);
          setActiveClass("has-warning");
        }else if(isPremium(domain.expires)) {
          setAvailable(true);
          setActiveClass("is-valid");
        } else {
          setAvailable(false);
          setActiveClass("");
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
      //e.preventDefault();
      if(!isValidName(input.current.value)) {
        setActiveClass("is-invalid");
        return;
      }
      const domain = normalizeName(input.current.value);
      navigate("/find?q="+ domain);
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
                  <div className="input-group input-group-lg"> 
                    <DelayInput minLength={3} delayTimeout={300} inputRef={input} className={"form-control " + activeClass} name="q" onChange={handleChange} value={query}   placeholder="Search for a Web3 username" />
                    <span className="input-group-text  bg-white">
                      {loading && <Spinner animation="border" variant="dark" size="sm" /> }
                      {!loading && <Search />}
                    </span>
                  </div>
                </form>
             </div>
          </div>
          <div className="row">
            <div className="col-lg-12 pt-3 text-center"> 
              {!query && <span className="text-muted text-center fs-6 fw-bold">Type 3 charcters or more to search.</span>}
              {!loading && query && options && options.length > 0 &&    
              <>
                {!isAvailable(options[0].expires) && 
                  <div className="d-flex flex-column  align-items-center">
                    <div className="d-flex flex-column justify-content-between align-items-center gap-2">
                        <span className="text-muted fs-4 fw-bold">
                        {options[0].label}.{options[0].extension} is not available 😭 
                        </span>
                        <span className="text-muted fw-bold">
                          Expires {getExpires(options[0].expires)}
                        </span>
                        <div className="text-muted fs-6 text-center">
                          This name was last registered on {getDateString(options[0].registered)}
                        </div>
                    </div> 
                  </div>
                }
                {isAvailable(options[0].expires) && 
                  <>
                    <div className="d-flex flex-row align-items-center justify-content-center">
                      <div className="d-flex flex-column justify-content-between align-items-center gap-2">
                        <span className="text-success fs-4 fw-bold">
                         {options[0].label}.{options[0].extension} is available 🥳
                        </span> 
                        <span className="text-muted fs-4 fw-bold"> 
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-row justify-content-center gap-3 mt-3"> 
                        <AddToCartButton domain={options[0]} />
                        {!inCart(options[0].id) && <ClaimNowButton domain={options[0]} />}
                        {inCart(options[0].id) && <ViewYourCartButton domain={options[0]} />}
                    </div> 
                  </>
                }
              </>    
              }
            </div> 
          </div>
        </div>
      </>
    );
};
  
export default Find;