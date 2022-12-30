import React from "react";  
import Filter from "./partials/Filter"; 
import {Helmet} from "react-helmet-async";
import Tabs from "./partials/Tabs";
import moment from "moment";
import { Container } from "react-bootstrap";
  
const PREMIUM_PERIOD =  Number(process.env.REACT_APP_PREMIUM_PERIOD);

const Expiring = () => {  
    return (
        <>
        <Helmet> 
            <title>About To Expire Web3 Domains - EnsOcean</title>
            <meta name="description" content="View all expiring ENS domains. Add them to your favorites and claim it for yourself in the future." />
        </Helmet>
        <Container className="bg-primary" fluid>
            <Container className="text-center p-3 text-white">
                <h1>Expiring Soon</h1>
            </Container>
        </Container>
        <Container className="p-0 m-0" fluid>
            <Container className="p-2" fluid>
                <Tabs tab="expiring" />
            </Container>
            <Container className="ps-3 pe-3" fluid>
                <Filter First={100} Skip={0} Tab={"expiring"} OrderBy={"expires"} OrderDirection={"asc"} Where={{
                        label_not: null,
                        expires_lte: moment().utc().unix(),
                        expires_gte: moment().add(-PREMIUM_PERIOD, "days").utc().unix()
                }} View="gallery" />
            </Container>
        </Container>
        </>
    ) 
};

 
  
export default Expiring;