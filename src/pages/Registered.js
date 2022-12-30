import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
import { Container } from "react-bootstrap";
 
const Registered = () => {  
    return (
        <>
        <Helmet> 
            <title>Registered Web3 Domains - EnsOcean</title>
            <meta name="description" content="View all registered ENS domains. See who is claiming which domains." />
        </Helmet> 
        <Container className="bg-primary" fluid>
            <Container className="text-center p-3 text-white">
                <h1>Recently Registered</h1>
            </Container>
        </Container>
        <Container className="p-0 m-0" fluid>
            <Container className="p-2" fluid>
                <Tabs tab="registered" />
            </Container>
            <Container className="ps-3 pe-3" fluid>
                <Filter First={100} 
                    Skip={0} 
                    Tab={"registered"} 
                    OrderBy={"registered"} 
                    OrderDirection={"desc"} 
                    Where={{label_not:null, registered_not: null }} 
                    View="gallery" />
            </Container>
        </Container>
        </>
    ) 
};

 
  
export default Registered;