import Carousel from "./partials/Carousel";
import RecentExpired from "./partials/RecentlyExpired";
import RecentRegistered from "./partials/RecentlyRegistered";
import {Helmet} from "react-helmet";

const Home = () => { 
  return (
      <> 
        <Helmet> 
              <title>Deep Dive Into ENS - EnsOcean</title>
              <meta name="description" content="ENS Ocean: Easily find and discover Ethereum Name Service (ENS) domains. Register/Renew your web3 username with the bulk tools. Trade your domains and more." />
        </Helmet>
        <Carousel />
        <div className="container">
          <div className="row gap-3 gap-lg-0 gap-md-3 gap-sm-3">
            <div className="col-lg-6">
            <RecentExpired />
            </div>
            <div className="col-lg-6">
            <RecentRegistered />
            </div>
          </div>
        </div>
      </>
  );
};
 
export default Home;