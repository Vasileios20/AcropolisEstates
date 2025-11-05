import React from "react";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ListingCreateEditForm.module.css";
import RegionCountyMunicipalitySelect from "components/createEditFormFields/RegionCountyMunicipalitySelect";

const LocationFields = ({
    listingData,
    handleChange,
    errors,
    t,
    onRegionChange,
    onCountyChange,
    onMunicipalityChange,
    selectedRegion,
    selectedCounty,
    selectedMunicipality,
    edit,
    renderTextField,
}) => {
    return (
        <>
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
                    {errors?.region_id?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                    {errors?.county_id?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                    {errors?.municipality_id?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                    {Object.entries(listingData).map(([fieldName, fieldValue]) => {
                        if (
                            fieldName === "address_street" ||
                            fieldName === "address_street_gr" ||
                            fieldName === "address_number" ||
                            fieldName === "postcode" ||
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
        </>
    )
}

export default LocationFields