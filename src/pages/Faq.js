import { Col, Container, Row } from "react-bootstrap";
import {Helmet} from "react-helmet-async";

const Faq = () => {
    return (
        <>  
        <Helmet> 
              <title>Frequently Asked Questions - EnsOcean</title>
              <meta name="description" content="Frequently Asked Questions" />
        </Helmet>
        <Container className="bg-primary" fluid>
          <Container className="text-center text-white p-3">
              <h1>Frequently Asked Questions</h1>
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

export default Faq;