import React from "react";
import NoResults from "../../assets/404-not-found.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

const NotFound = () => {
  return (
    <Row>
      <Col className="d-flex justify-content-center">
        <Image src={NoResults} className="img-fluid" />
      </Col>
    </Row>
  );
};

export default NotFound;
