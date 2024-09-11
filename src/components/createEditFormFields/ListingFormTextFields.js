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
            <Form.Label>{listingData.currency} Price</Form.Label>
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
        <>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group controlId="floor_area">
                <Form.Label>Floor Area (m²)</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="number"
                  name="floor_area"
                  value={listingData.floor_area}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors?.floor_area?.map((message, idx) => (
                <Alert className={styles.Input} variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group controlId="land_area">
                <Form.Label>Land Area (m²)</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="number"
                  name="land_area"
                  value={listingData.land_area}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors?.land_area?.map((message, idx) => (
                <Alert className={styles.Input} variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Col>
          </Row>
          {Object.entries(listingData).map(([fieldName, fieldValue]) => {
            if (
              fieldName === "levels" ||
              fieldName === "floor" ||
              fieldName === "rooms" ||
              fieldName === "bathrooms" ||
              fieldName === "wc" ||
              fieldName === "heating_system" ||
              fieldName === "heating_system_gr"
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
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group controlId="energy_class">
                <Form.Label>Energy class</Form.Label>
                <Form.Control
                  className={styles.Input}
                  as="select"
                  name="energy_class"
                  value={listingData.energy_class}
                  onChange={handleChange}
                >
                  <option>---</option>
                  {Array.from("ABCDEFG").map((letter) => (
                    <option key={letter}>{letter}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              {errors?.energy_class?.map((message, idx) => (
                <Alert className={styles.Input} variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group controlId="power_type">
                <Form.Label>Power Type</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  name="power_type"
                  value={listingData.power_type}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors?.power_type?.map((message, idx) => (
                <Alert className={styles.Input} variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group controlId="power_type_gr">
                <Form.Label>Power Type gr</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  name="power_type_gr"
                  value={listingData.power_type_gr}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors?.power_type_gr?.map((message, idx) => (
                <Alert className={styles.Input} variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form.Group controlId="construction_year">
                <Form.Label>Construction Year</Form.Label>
                <Form.Control
                  className={styles.Input}
                  as="select"
                  name="construction_year"
                  value={listingData.construction_year}
                  onChange={handleChange}
                >
                  {Array.from(
                    { length: new Date().getFullYear() - 1899 },
                    (_, i) => i + 1900
                  ).map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              {errors?.construction_year?.map((message, idx) => (
                <Alert className={styles.Input} variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
            </Col>
          </Row>
        </>}

      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="availability">
            <Form.Label>Availability</Form.Label>
            <Form.Control
              className={styles.Input}
              type="date"
              name="availability"
              value={listingData.availability}
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
