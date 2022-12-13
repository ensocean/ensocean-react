import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet";  
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
            <div className="card text-center">
                <div className="card-header border-0">
                     <Tabs tab="registered" />
                </div>
                <div className="card-body p-2">
                    <Filter First={100} Skip={0} Tab={"registered"} OrderBy={"registered"} OrderDirection={"desc"} Where={{label_not:null, registered_not: null }} View="gallery" />
                </div>
            </div>
        </div> 
        </>
    ) 
};

 
  
export default Registered;