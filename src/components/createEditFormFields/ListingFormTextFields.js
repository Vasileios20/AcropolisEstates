import React from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ListingCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

import ResidentialFields from "./ResidentialFields";
import LandFields from "./LandFields";
import CommercialFields from "./CommercialFields";

const ListingTextFields = ({ listingData, handleChange, history, errors, create }) => {
  const renderTextField = (fieldName, label, type = "text", rows = 1) => (
    <Form.Group controlId={fieldName}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className={styles.Input}
        type={type}
        name={fieldName}
        value={listingData[fieldName]}
        onChange={handleChange}
        as={type === "textarea" ? "textarea" : undefined}
        rows={rows}
      />
      {errors?.[fieldName]?.map((message, idx) => (
        <Alert className={styles.Input} variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
    </Form.Group>
  );

  const handleChecked = (e) => {
    handleChange({
      target: {
        name: e.target.name,
        value: e.target.checked,
      },
    });
  }

  return (
    <div className="text-center">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="sale_type">
            <Form.Label>Sale type</Form.Label>
            <Form.Control
              className={`${styles.Input}`}
              as="select"
              name="sale_type"
              value={listingData.sale_type}
              onChange={handleChange}
            >
              <option>---</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </Form.Control>
          </Form.Group>
          {errors?.sale_type?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="type">
            <Form.Label>Property type</Form.Label>
            <Form.Control
              className={styles.Input}
              as="select"
              name="type"
              value={listingData.type}
              onChange={handleChange}
            >
              <option>---</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
            </Form.Control>
          </Form.Group>
          {errors?.type?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="sub_type">
            <Form.Label>Sub type</Form.Label>
            <Form.Control
              className={`${styles.Input}`}
              as="select"
              name="sub_type"
              value={listingData.sub_type}
              onChange={handleChange}
            >
              <option>---</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="maisonette">Maisonette</option>
              <option value="bungalow">Bungalow</option>
              <option value="villa">Villa</option>
              <option value="hotel">Hotel</option>
              <option value="office">Office</option>
              <option value="retail">Retail</option>
              <option value="warehouse">Warehouse</option>
              <option value="mixed_use">Mixed use</option>
              <option value="industrial">Industrial</option>
              <option value="other">Other</option>

            </Form.Control>
          </Form.Group>
          {errors?.sub_type?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="price">
            <Form.Label>{listingData.currency === "---" ? "" : listingData.currency} Price</Form.Label>
            <Form.Control
              className={styles.Input}
              type="number"
              name="price"
              value={listingData.price}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.price?.map((message, idx) => (
            <Alert className={styles.Input} variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="currency">
            <Form.Label>Currency</Form.Label>
            <Form.Control
              className={styles.Input}
              as="select"
              name="currency"
              value={listingData.currency}
              onChange={handleChange}
            >
              <option>---</option>
              <option value="€">€ EUR</option>
              <option value="$">$ USD</option>
              <option value="£">£ GBP</option>
            </Form.Control>
          </Form.Group>
          {errors?.currency?.map((message, idx) => (
            <Alert className={styles.Input} variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>
      <Row className="justify-content-center mt-2">
        <Col md={6}>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              className={styles.Input}
              as="textarea"
              rows={3}
              name="description"
              value={listingData.description}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.description?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
        <Col md={6}>
          <Form.Group controlId="description_gr">
            <Form.Label>Description GR</Form.Label>
            <Form.Control
              className={styles.Input}
              as="textarea"
              rows={3}
              name="description_gr"
              value={listingData.description_gr}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.description?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>
      <hr />
      <Container fluid>
        <Row>
          <h1>Address</h1>
          {Object.entries(listingData).map(([fieldName, fieldValue]) => {
            if (
              fieldName === "address_street" ||
              fieldName === "address_street_gr" ||
              fieldName === "address_number" ||
              fieldName === "address_postal_code" ||
              fieldName === "city" ||
              fieldName === "city_gr" ||
              fieldName === "region" ||
              fieldName === "region_gr" ||
              fieldName === "county" ||
              fieldName === "county_gr" ||
              fieldName === "municipality" ||
              fieldName === "municipality_gr"
            ) {
              return (
                <Row className="justify-content-center" key={fieldName}>
                  <Col md={6}>
                    {renderTextField(fieldName, fieldName.charAt(0).toUpperCase() + fieldName.slice(1))}
                  </Col>
                </Row>

              );
            }
            return null;
          })}
        </Row>
      </Container>
      <hr />
      <h1>Features</h1>

      {/* // RESIDENTIAL FIELDS */}

      {listingData.type === "residential" &&
        <ResidentialFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
        />
      }

      {/* // LAND FIELDS */}

      {listingData.type === "land" &&
        <LandFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
        />
      }

      {/* // COMMERCIAL FIELDS */}

      {listingData.type === "commercial" &&
        <CommercialFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
        />
      }

      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="availability">
            <Form.Label>Availability</Form.Label>
            <Form.Control
              className={styles.Input}
              type="date"
              name="availability"
              value={listingData.availability || ""}
              onChange={handleChange}
            />
          </Form.Group>
          {errors?.availability?.map((message, idx) => (
            <Alert className={styles.Input} variant="warning" key={idx}>
              {message}
            </Alert>
          ))}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="longitude">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              className={styles.Input}
              type="decimal"
              name="longitude"
              value={listingData.longitude}
              onChange={handleChange}
            />
            {errors?.longitude?.map((message, idx) => (
              <Alert className={styles.Input} variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="latitude">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              className={styles.Input}
              type="decimal"
              name="latitude"
              value={listingData.latitude}
              onChange={handleChange}
            />
            {errors?.latitude?.map((message, idx) => (
              <Alert className={styles.Input} variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Approved</Form.Label>
            <Form.Check
              type="checkbox"
              name="approved"
              checked={listingData.approved}
              onChange={handleChecked}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Featured</Form.Label>
            <Form.Check
              type="checkbox"
              name="featured"
              checked={listingData.featured}
              onChange={handleChecked}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button
        className={`${btnStyles.Button} ${btnStyles.Remove} m-3`}
        onClick={() => history.goBack()}
      >
        Cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Black} m-3`} type="submit">
        {create ? "Create" : "Update"}
      </Button>
    </div>
  );
};

export default ListingTextFields;
