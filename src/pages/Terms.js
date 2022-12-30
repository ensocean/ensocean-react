import { Col, Container, Row } from "react-bootstrap";
import {Helmet} from "react-helmet-async";

const Terms = () => {
    return (
      <>  
        <Helmet> 
              <title>Terms of Use - EnsOcean</title>
              <meta name="description" content="Terms of Use" />
        </Helmet>
        <Container className="bg-primary" fluid>
          <Container className="text-center text-white p-3">
              <h1>Terms of Use</h1>
          </Container>
        </Container>
        <Container>
          <Row>
            <Col lg="12">
              
            </Col>
          </Row>
        </Container>
      </>
    );
};
  
export default Terms;