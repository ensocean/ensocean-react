import {Helmet} from "react-helmet"; 
import { useLocation, useParams } from "react-router-dom"; 
import Filter from "./partials/Filter"; 
import AccountInfo from "./partials/AccountInfo";
import AccountTabs from "./partials/AccountTabs";
import { useWatchlist } from "react-use-watchlist";
import { useAccount } from "wagmi"; 

const Account = () => {
    const addr = useParams().address;  
    const { isConnected, address } = useAccount();   
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const { items } = useWatchlist();   
 
    return (
      <>
      <Helmet> 
          <title>{addr} - EnsOcean</title>
          <meta name="description" content={"See which ENS domains does the account ("+ addr +") have."} />
      </Helmet>
      <div className="container-fluid bg-primary">
        <div className="container-fluid container-fluid p-0 pt-4 pb-4 text-white">
            <AccountInfo />
        </div>
      </div>
      <div className="container-fluid p-0 m-0"> 
        <div className="card text-center">
                <div className="card-header border-0">
                    <AccountTabs account={addr} tab="" />
                </div>
                <div className="card-body p-2">
                    {tab == "" || tab === null &&  
                    <Filter First={100} Skip={0} OrderBy={"created"} OrderDirection={"desc"} Where={{
                        label_not: null, 
                        owner: addr.toLowerCase()
                    }} />}

                    {tab == "watchlist" && isConnected && address === addr &&
                    <Filter First={100} Skip={0} Tab={"watchlist"} OrderBy={"expires"} OrderDirection={"desc"} Where={{
                            label_not:null, 
                            id_in: items.map(t=> t.id) 
                    }} View="gallery" />}
                </div>
        </div>  
      </div>  
      </> 
    );
};
  
export default Account;