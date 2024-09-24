import React from "react";
import forbidden from "../../assets/403-forbidden.png";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

const Forbidden403 = () => {
  return (
    <Row>
      <Col className="d-flex justify-content-center">
        <Image src={forbidden} className="img-fluid" />
      </Col>
    </Row>
  );
};

export default Forbidden403;
