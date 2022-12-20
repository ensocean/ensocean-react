import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
 
const Discover = () => {  
    return (
        <>
        <Helmet> 
            <title>Browse Web3 Domains - EnsOcean</title>
            <meta name="description" content={"View all ENS domains. Find your web3 domain name idea."} />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>{"Browse"}</h1>
            </div> 
        </div>
        <div className="container-fluid p-0 m-0">
            <div className="container-fluid p-2">
                    <Tabs tab={"all"} /> 
            </div>
            <div className="container-fluid ps-3 pe-3">
                <Filter First={100} Skip={0} Tab={"all"} OrderBy={"created"} OrderDirection={"desc"} Where={{
                    label_not: null
                }} View="gallery" />
            </div>
        </div> 
        </>
    ) 
};

  
export default Discover;