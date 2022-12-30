import Carousel from "./partials/Carousel";
import RecentExpired from "./partials/RecentlyExpired";
import RecentRegistered from "./partials/RecentlyRegistered";
import {Helmet} from "react-helmet-async";
import AutoComplete from "../components/AutoComplete";
import { Col, Container, Row } from "react-bootstrap";

const Home = () => { 
  return (
      <> 
        <Helmet> 
              <title>Deep Dive Into ENS - EnsOcean</title>
              <meta name="description" content="ENS Ocean: Easily find and discover Ethereum Name Service (ENS) domains. Register/Renew your web3 username with the bulk tools. Trade your domains and more." />
        </Helmet>
        <Carousel />
        <Container>
          <Row className="gap-3 gap-lg-0 gap-md-3 gap-sm-3">
            <Col className="mb-1 d-block d-lg-none" lg>
                <AutoComplete />
            </Col>
            <Col>
              <RecentExpired />
            </Col>
            <Col>
              <RecentRegistered />
            </Col>
          </Row>
        </Container>
      </>
  );
};
 
export default Home;