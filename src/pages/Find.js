import React, { useState, useRef, useEffect }  from "react"; 
import { useLocation, useNavigate} from "react-router-dom";  
import { Helmet } from "react-helmet-async";
import { useLazyQuery, gql } from "@apollo/client";
import { getLabelHash, getLength, isExpired, isExpiring, isPremium, isValidDomain, isValidName, normalizeName, getDateString, isAvailable, getTimeAgo} from '../helpers/String';
import AddToCartButton from "../components/AddToCartButton";
import ClaimNowButton from "../components/ClaimNowButton";
import { useRegisterlist } from "react-use-registerlist";
import ViewYourCartButton from "../components/ViewYourCartButton"; 
import { Search } from "react-bootstrap-icons";
import { Col, Container, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { DelayInput } from "react-delay-input";
import { GET_DOMAINS } from "../graphql/Queries";
import AddToWatchlistSmallButton from "../components/AddToWatchlistSmallButton";
 
const Find = () => { 
    const location = useLocation(); 
    const navigate = useNavigate(); 
    const input = useRef();
    const [query, setQuery] = useState(null);  
    const [options, setOptions] = useState(null);  
    const [activeClass, setActiveClass] = useState("");
    const [getDomains, { data, loading, error }] = useLazyQuery(GET_DOMAINS); 
    const {  inRegisterlist } = useRegisterlist();
      
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

    useEffect(()=> {
      const search = new URLSearchParams(location.search);
      let q = search.get("q") || "";
      
      q = q.toLowerCase().trim(); 
      setQuery(q); 
      setActiveClass("");
       
      if(getLength(q) < 3) {  
          return;
      } 

      if(q.lastIndexOf(".eth") !== -1) {
          q = q.substring(0, q.lastIndexOf(".eth"));
      }

      if(!isValidDomain(q)) {    
          setActiveClass("is-invalid");
          return;
      } 

      let options = [ { id: getLabelHash(q), label: q, extension: "eth", expires: null, price: 0, available: false, valid: isValidDomain(q) }]; 
      const labels = options.map(t=> t.id);

       getDomains({ variables: { labels }});
      
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
          setActiveClass("is-valid");
        } else if(isExpiring(domain.expires)) { 
          setActiveClass("has-warning");
        }else if(isPremium(domain.expires)) { 
          setActiveClass("is-valid");
        } else { 
          setActiveClass("");
        }
        
      } else {
        setOptions(options); 
        setActiveClass("is-valid");
      }

    }, [location, data, getDomains]);
  
    return (
        <>  
        <Helmet> 
              <title>Find Your Web3 Name - EnsOcean</title>
              <meta name="description" content="Find your next Ethereum Name Service (ENS) domain easily. Catch expired domains or get suggestions to find out." />
        </Helmet>
        <Container className="bg-primary" fluid>
          <Container className="text-center p-3 text-white">
            <h1>Find Your Web3 Name</h1>
          </Container>
        </Container>
        <Container>
          <Row>
            <Col className="pt-3">
              <Form onSubmit={handleSubmit}>
                <InputGroup className="input-group-lg">
                    <DelayInput minLength={3} delayTimeout={300} inputRef={input} className={"form-control " + activeClass} name="q" onChange={handleChange} value={query}   placeholder="Search for a Web3 username" />
                    <span className="input-group-text bg-white">
                      {loading && <Spinner animation="border" variant="dark" size="sm" /> }
                      {!loading && <Search />}
                    </span>
                  </InputGroup>
                </Form>
            </Col>
          </Row>
          <Row>
            <Col className="pt-3">
              {error && <span className="text-danger">There was an error. Please try again.</span>}
              {!query && <span className="text-muted text-center fs-6 fw-bold">Type 3 charcters or more to search.</span>}
              {!loading && query && options && options.length > 0 &&    
              <>
                {!isAvailable(options[0].expires) && 
                  <div className="d-flex flex-column justify-content-center gap-2 p-2">
                    <div className="d-flex flex-row justify-content-between align-items-start gap-2">
                        <span className="text-muted fs-4 fw-bold text-truncate">
                        {options[0].label}.{options[0].extension} is not available 😭 
                        </span> 
                    </div> 
                    <div className="d-flex flex-row justify-content-between gap-2">
                      <span className="text-muted">
                        Expires {getTimeAgo(options[0].expires)}
                      </span>
                      <AddToWatchlistSmallButton domain={options[0]} />
                    </div>
                  </div>
                }
                {isAvailable(options[0].expires) && 
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 p-2">
                      <div className="d-flex flex-row justify-content-center align-items-center gap-2 text-truncate">
                        <span className="text-success fs-4 fw-bold text-truncate">
                         {options[0].label}.{options[0].extension} is available 🥳
                        </span> 
                      </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between align-items-center gap-2 p-2"> 
                          <div className="d-flex flex-row gap-2">
                            <AddToCartButton domain={options[0]} />
                            {!inRegisterlist(options[0].id) && <ClaimNowButton domain={options[0]} />}
                            {inRegisterlist(options[0].id) && <ViewYourCartButton domain={options[0]} />}
                          </div>
                          <AddToWatchlistSmallButton domain={options[0]} />
                      </div>
                  </>
                }
              </>    
              }
            </Col>
          </Row>
        </Container>
      </>
    );
};
  
export default Find;