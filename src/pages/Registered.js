import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
 
const Registered = () => {  
    return (
        <>
        <Helmet> 
            <title>Registered Web3 Domains - EnsOcean</title>
            <meta name="description" content="View all registered ENS domains. See who is claiming which domains." />
        </Helmet>
        <div className="container-fluid bg-primary">
            <div className="container text-center p-3 text-white">
                <h1>Recently Registered</h1>
            </div> 
        </div>
        <div className="container-fluid p-0 m-0">
                <div className="container-fluid p-2">
                     <Tabs tab="registered" />
                </div>
                <div className="container-fluid ps-3 pe-3">
                    <Filter First={100} Skip={0} Tab={"registered"} OrderBy={"registered"} OrderDirection={"desc"} Where={{label_not:null, registered_not: null }} View="gallery" />
                </div>
        </div> 
        </>
    ) 
};

 
  
export default Registered;