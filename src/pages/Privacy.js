import { Col, Container, Row } from "react-bootstrap";
import {Helmet} from "react-helmet-async";

const Privacy = () => {
    return (
        <>  
        <Helmet> 
            <title>Privacy Policy - EnsOcean</title>
            <meta name="description" content="Privacy Policy" />
        </Helmet>
        <Container className="bg-primary" fluid>
          <Container className="text-center text-white p-3">
              <h1>Privacy Policy</h1>
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
  
export default Privacy;