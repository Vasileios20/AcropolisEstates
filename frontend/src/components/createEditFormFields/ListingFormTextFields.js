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

import { useTranslation } from "react-i18next";
import RegionCountyMunicipalitySelect from "./RegionCountyMunicipalitySelect";

const ListingTextFields = (
  {
    listingData,
    setListingData,
    handleChange,
    history,
    errors,
    create,
    handleAmenityChange,
    selectedAmenities,
    edit,
    onRegionChange,
    onCountyChange,
    onMunicipalityChange,
    selectedRegion,
    selectedCounty,
    selectedMunicipality,
  }) => {

  const { t } = useTranslation();

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
  };

  return (
    <div className="text-center">
      <h2>{t("createEditForm.headers.basicInfo")}</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="sale_type">
            <Form.Label>{t("propertyDetails.typeField")}</Form.Label>
            <Form.Control
              className={`${styles.Input}`}
              as="select"
              name="sale_type"
              value={listingData.sale_type}
              onChange={handleChange}
            >
              <option>---</option>
              <option value="rent">{t("propertyDetails.typeRent")}</option>
              <option value="sale">{t("propertyDetails.typeSale")}</option>
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
            <Form.Label>{t("propertyDetails.types.title")}</Form.Label>
            <Form.Control
              className={styles.Input}
              as="select"
              name="type"
              value={listingData.type}
              onChange={handleChange}
            >
              <option>---</option>
              <option value="land">{t("propertyDetails.types.land")}</option>
              <option value="commercial">{t("propertyDetails.types.commercial")}</option>
              <option value="residential">{t("propertyDetails.types.residential")}</option>
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
            <Form.Label>{t("propertyDetails.subTypes.title")}</Form.Label>
            <Form.Control
              className={`${styles.Input}`}
              as="select"
              name="sub_type"
              value={listingData.sub_type}
              onChange={handleChange}
            >
              <option>---</option>
              <option value="apartment">{t("propertyDetails.subTypes.apartment")}</option>
              <option value="house">{t("propertyDetails.subTypes.house")}</option>
              <option value="maisonette">{t("propertyDetails.subTypes.maisonette")}</option>
              <option value="bungalow">{t("propertyDetails.subTypes.bungalow")}</option>
              <option value="villa">{t("propertyDetails.subTypes.villa")}</option>
              <option value="hotel">{t("propertyDetails.subTypes.hotel")}</option>
              <option value="office">{t("propertyDetails.subTypes.office")}</option>
              <option value="retail">{t("propertyDetails.subTypes.retail")}</option>
              <option value="warehouse">{t("propertyDetails.subTypes.warehouse")}</option>
              <option value="mixed_use">{t("propertyDetails.subTypes.mixed_use")}</option>
              <option value="industrial">{t("propertyDetails.subTypes.industrial")}</option>
              <option value="other">{t("propertyDetails.subTypes.other")}</option>
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
          <Form.Group controlId="currency">
            <Form.Label>{t("propertyDetails.currency")}</Form.Label>
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
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group controlId="price">
            <Form.Label>{t("propertyDetails.price")} {listingData.currency === "---" ? "" : listingData.currency}</Form.Label>
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
          <Form.Group controlId="availability">
            <Form.Label>{t("propertyDetails.availability")}</Form.Label>
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
      <hr />
      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <Form.Group controlId="description">
            <Form.Label>{t("propertyDetails.description")}</Form.Label>
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
            <Form.Label>{t("propertyDetails.description_gr")}</Form.Label>
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
          <h2>{t("createEditForm.headers.addressInfo")}</h2>
          <RegionCountyMunicipalitySelect
            onRegionChange={onRegionChange}
            onCountyChange={onCountyChange}
            onMunicipalityChange={onMunicipalityChange}
            selectedRegion={selectedRegion}
            selectedCounty={selectedCounty}
            selectedMunicipality={selectedMunicipality}
            listingData={listingData}
            edit={edit}
          />
          {Object.entries(listingData).map(([fieldName, fieldValue]) => {
            if (
              fieldName === "address_street" ||
              fieldName === "address_street_gr" ||
              fieldName === "address_number" ||
              fieldName === "postcode" ||
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
                    {renderTextField(fieldName, t(`propertyDetails.${fieldName.charAt(0).toLowerCase()}${fieldName.slice(1)}`))}
                  </Col>
                </Row>

              );
            }
            return null;
          })}
        </Row>

        <Row className="justify-content-center">
          <Col md={6}>
            <Form.Group controlId="latitude">
              <Form.Label>{t("propertyDetails.latitude")}</Form.Label>
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
            <Form.Group controlId="longitude">
              <Form.Label>{t("propertyDetails.longitude")}</Form.Label>
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
      </Container>
      <hr />

      {/* // RESIDENTIAL FIELDS */}

      {listingData.type === "residential" &&
        <ResidentialFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
          handleAmenityChange={handleAmenityChange}
          selectedAmenities={selectedAmenities}
          create={create}
        />
      }

      {/* // LAND FIELDS */}

      {listingData.type === "land" &&
        <LandFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
          handleAmenityChange={handleAmenityChange}
          selectedAmenities={selectedAmenities}
          create={create}
        />
      }

      {/* // COMMERCIAL FIELDS */}

      {listingData.type === "commercial" &&
        <CommercialFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
          handleAmenityChange={handleAmenityChange}
          selectedAmenities={selectedAmenities}
          create={create}
        />
      }

      <hr />



      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Group>
            <Form.Label>{t("propertyDetails.approved")}</Form.Label>
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
            <Form.Label>{t("propertyDetails.featured")}</Form.Label>
            <Form.Check
              type="checkbox"
              name="featured"
              checked={listingData.featured}
              onChange={handleChecked}
            />
          </Form.Group>
        </Col>
      </Row>

      {errors?.images?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      {errors?.is_first?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Remove} m-3`}
        onClick={() => history.goBack()}
      >
        {t("createEditForm.button.cancel")}
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Black} m-3`} type="submit">
        {create ? t("createEditForm.button.create") : t("createEditForm.button.update")}
      </Button>
    </div>
  );
};

export default ListingTextFields;
