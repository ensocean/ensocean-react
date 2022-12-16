import { Link } from "react-router-dom";
import {Helmet} from "react-helmet-async";

const NotFound = () => {
    return (
        <>  
        <Helmet> 
              <title>Page Not Found - EnsOcean</title>
              <meta name="description" content="We could not found the page that you were looking for" />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>Page Not Found!</h1>
            </div> 
        </div>
        <div className="container">
          <p className="text-center m-5">
            <Link to="/" title="Go to home">Go to home page</Link>
          </p>
        </div>
      </>
    );
};
  
export default NotFound;