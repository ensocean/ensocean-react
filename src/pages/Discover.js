import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
import { Container } from "react-bootstrap";
 
const Discover = () => {  
    return (
        <>
        <Helmet> 
            <title>Browse Web3 Domains - EnsOcean</title>
            <meta name="description" content={"View all ENS domains. Find your web3 domain name idea."} />
        </Helmet> 
        <Container className="bg-primary" fluid>
            <Container className="text-center p-3 text-white">
                <h1>Browse</h1>
            </Container>
        </Container>
        <Container className="p-0 m-0" fluid>
            <Container className="p-2" fluid>
                <Tabs tab={"all"} />
            </Container>
            <Container className="ps-3 pe-3" fluid>
                <Filter First={100} Skip={0} Tab={"all"} OrderBy={"created"} OrderDirection={"desc"} Where={{
                    label_not: null
                    }} View="gallery" />
            </Container>
        </Container>
        </>
    ) 
};

  
export default Discover;