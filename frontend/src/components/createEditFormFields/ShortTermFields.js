import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/ListingCreateEditForm.module.css';
import { useTranslation } from 'react-i18next';
import { useRouteFlags } from 'contexts/RouteProvider';
import AmenitiesShortTerm from 'components/createEditFormFields/amenities/AmenitiesShortTerm';


const ShortTermFields = (
    {
        listingData,
        handleChange,
        history,
        errors,
        renderTextField,
        handleAmenityChange,
        selectedAmenities,
        create,
    }) => {
    const { t } = useTranslation();
    const { shortTermListing } = useRouteFlags();

    return (
        <>
            <h2>{t('createEditForm.headers.shortTermTechnical')}</h2>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="floor_area">
                        <Form.Label>{t("propertyDetails.floorArea")} (m²)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="floor_area"
                            value={listingData.floor_area || ""}
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

            {Object.entries(listingData).map(([fieldName]) => {
                if (
                    fieldName === "bedrooms" ||
                    fieldName === "kitchens" ||
                    fieldName === "bathrooms" ||
                    fieldName === "wc" ||
                    fieldName === "living_rooms" ||
                    fieldName === "floor" ||
                    (shortTermListing ? "" : fieldName === "levels")
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
            <Row className={shortTermListing ? "justify-content-center" : "d-none"}>
                <Col md={6}>
                    <Form.Group controlId="max_guests">
                        <Form.Label>{t("propertyDetails.maxGuests")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="max_guests"
                            value={listingData.max_guests || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.max_guests?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className={shortTermListing ? "justify-content-center" : "d-none"}>
                <Col md={6}>
                    <Form.Group controlId="max_adults">
                        <Form.Label>{t("propertyDetails.maxAdults")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="max_adults"
                            value={listingData.max_adults || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.max_adults?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className={shortTermListing ? "justify-content-center" : "d-none"}>
                <Col md={6}>
                    <Form.Group controlId="max_children">
                        <Form.Label>{t("propertyDetails.maxChildren")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="max_children"
                            value={listingData.max_children || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.max_children?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>


            <hr />
            <Row className="justify-content-center mt-4">
                <AmenitiesShortTerm
                    handleAmenityChange={handleAmenityChange}
                    selectedAmenities={selectedAmenities}
                    create={create}
                />
            </Row>
        </>
    );
};

export default ShortTermFields;