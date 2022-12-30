import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
import moment from "moment";
import { Container } from "react-bootstrap";
 
const GRACE_PERIOD = Number(process.env.REACT_APP_GRACE_PREIOD);
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

const Expired = () => {  
    return (
        <>
        <Helmet> 
            <title>Dropped ENS Web3 Domains - EnsOcean</title>
            <meta name="description" content="View all expired ENS domains. Catch and claim again for yourself easily." />
        </Helmet>
        <Container className="bg-primary" fluid>
            <Container className="text-center p-3 text-white">
                <h1>Recently Expired</h1>
            </Container>
        </Container>
        <Container className="p-0 m-0" fluid>
            <Container className="p-2" fluid>
                <Tabs tab="expired" />
            </Container>
            <Container className="ps-3 pe-3" fluid>
                <Filter First={100} Skip={0} Tab={"expired"} OrderBy={"expires"} OrderDirection={"desc"} Where={{
                        label_not: null,
                        expires_lte: moment().add(-GRACE_PERIOD, "days").add(-PREMIUM_PERIOD, "days").utc().unix() 
                }} View="gallery" />
            </Container>
        </Container>
        </>
    ) 
};

 
  
export default Expired;