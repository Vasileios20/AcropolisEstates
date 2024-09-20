import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/ListingCreateEditForm.module.css';
import { useTranslation } from 'react-i18next';
import { AmenitiesLand } from './amenities/AmenitiesLand';


const LandFields = (
    {
        listingData,
        handleChange,
        history,
        errors,
        create,
        renderTextField,
        handleAmenityChange,
        selectedAmenities,
    }) => {

    const { t } = useTranslation();

    return (
        <>
            <h2>{t("createEditForm.headers.landTechincal")}</h2>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="land_area">
                        <Form.Label>{t("propertyDetails.landArea")} (m²)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="land_area"
                            value={listingData.land_area || ""}
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
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="cover_coefficient">
                        <Form.Label>{t("propertyDetails.cover_coefficient")} (%)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="cover_coefficient"
                            value={listingData.cover_coefficient || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.cover_coefficient?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="building_coefficient">
                        <Form.Label>{t("propertyDetails.building_coefficient")} (%)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="building_coefficient"
                            value={listingData.building_coefficient || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.building_coefficient?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="length_of_facade">
                        <Form.Label>{t("propertyDetails.lengthOfFacade")} (m)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="length_of_facade"
                            value={listingData.length_of_facade || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.length_of_facade?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="orientation">
                        <Form.Label>{t("propertyDetails.orientationTypes.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="orientation"
                            value={listingData.orientation || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="north">{t("propertyDetails.orientationTypes.north")}</option>
                            <option value="north_east">{t("propertyDetails.orientationTypes.north_east")}</option>
                            <option value="east">{t("propertyDetails.orientationTypes.east")}</option>
                            <option value="south_east">{t("propertyDetails.orientationTypes.south_east")}</option>
                            <option value="south">{t("propertyDetails.orientationTypes.south")}</option>
                            <option value="south_west">{t("propertyDetails.orientationTypes.south_west")}</option>
                            <option value="west">{t("propertyDetails.orientationTypes.west")}</option>
                            <option value="north_west">{t("propertyDetails.orientationTypes.north_west")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.orientation?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="view">
                        <Form.Label>{t("propertyDetails.viewTypes.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="view"
                            value={listingData.view || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="sea">{t("propertyDetails.viewTypes.sea")}</option>
                            <option value="mountain">{t("propertyDetails.viewTypes.mountain")}</option>
                            <option value="city">{t("propertyDetails.viewTypes.city")}</option>
                            <option value="other">{t("propertyDetails.viewTypes.other")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.view?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="slope">
                        <Form.Label>{t("propertyDetails.slopeTypes.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="slope"
                            value={listingData.slope || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="level">{t("propertyDetails.slopeTypes.level")}</option>
                            <option value="view">{t("propertyDetails.slopeTypes.view")}</option>
                            <option value="incline">{t("propertyDetails.slopeTypes.incline")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.slope?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="zone">
                        <Form.Label>{t("propertyDetails.zoneTypes.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="zone"
                            value={listingData.zone || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="residential">{t("propertyDetails.zoneTypes.residential")}</option>
                            <option value="commercial">{t("propertyDetails.zoneTypes.commercial")}</option>
                            <option value="industrial">{t("propertyDetails.zoneTypes.industrial")}</option>
                            <option value="agricultural">{t("propertyDetails.zoneTypes.agricultural")}</option>
                            <option value="tourist">{t("propertyDetails.zoneTypes.tourist")}</option>
                            <option value="mixed">{t("propertyDetails.zoneTypes.mixed")}</option>
                            <option value="redevelopment">{t("propertyDetails.zoneTypes.redevelopment")}</option>
                            <option value="other">{t("propertyDetails.zoneTypes.other")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.zone?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="distance_from_sea">
                        <Form.Label>{t("propertyDetails.distanceFromSea")} (m)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="distance_from_sea"
                            value={listingData.distance_from_sea || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.distance_from_sea?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <hr />
            <Row className="justify-content-center mt-4">
                <AmenitiesLand
                    handleAmenityChange={handleAmenityChange}
                    selectedAmenities={selectedAmenities}
                    create={create}
                />
            </Row>
        </>
    )
}

export default LandFields;