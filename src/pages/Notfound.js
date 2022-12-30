import { Link } from "react-router-dom";
import {Helmet} from "react-helmet-async";
import { Col, Container, Row } from "react-bootstrap";

const NotFound = () => {
    return (
        <>  
        <Helmet> 
              <title>Page Not Found - EnsOcean</title>
              <meta name="description" content="We could not found the page that you were looking for" />
        </Helmet>
        <Container className="bg-primary" fluid>
          <Container className="text-center text-white p-3">
            <h1>Page Not Found!</h1>
          </Container>
        </Container>
        <Container>
          <Row>
            <Col>
              <p className="text-center m-5">
                <Link to="/" title="Go to home">Go to home page</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </>
    );
};
  
export default NotFound;