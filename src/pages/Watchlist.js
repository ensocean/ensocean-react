import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet";   
import { useWatchlist } from "react-use-watchlist";
import AccountTabs from "./partials/AccountTabs";
import AccountInfo from "./partials/AccountInfo";
import { useAccount } from 'wagmi';  
import { useParams } from "react-router-dom";
  
const Watchlist = () => {  
    const addr = useParams().address;
    const { isConnected, address } = useAccount();   
    const { items } = useWatchlist();  
    
    return (
        <>

        <Helmet> 
            <title>My Watchlist- EnsOcean</title>
            <meta name="description" content="" />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container-fluid container-fluid p-0 pt-4 pb-4 text-white">
                <AccountInfo />
            </div>
        </div>
        <div className="container-fluid p-0 m-0"> 
            <div className="card text-center">
                <div className="card-header border-0">
                    <AccountTabs account={address} tab="watchlist" />
                </div>
                <div className="card-body p-2">
                    {isConnected && address === addr &&
                    <Filter First={100} Skip={0} Tab={"watchlist"} OrderBy={"expires"} OrderDirection={"desc"} Where={{
                            label_not:null,
                            id_in: items.map(t=> t.id) 
                    }} View="gallery" />}
                </div>
            </div> 
        </div>  
        </>
    ) 
};

 
  
export default Watchlist;