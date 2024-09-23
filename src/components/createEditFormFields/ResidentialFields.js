import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/ListingCreateEditForm.module.css';
import { useTranslation } from 'react-i18next';
import { AmenitiesResidential } from './amenities/AmenitiesResidential';


const ResidentialFields = (
    {
        listingData,
        handleChange,
        history,
        errors,
        renderTextField,
        handleAmenityChange,
        selectedAmenities,
        create
    }) => {
    const { t } = useTranslation();
    return (
        <>
            <h2>{t('createEditForm.headers.residentialTechnical')}</h2>
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
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="land_area">
                        <Form.Label>{t("propertyDetails.landArea")} </Form.Label>
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
            {Object.entries(listingData).map(([fieldName]) => {
                if (
                    fieldName === "bedrooms" ||
                    fieldName === "kitchens" ||
                    fieldName === "bathrooms" ||
                    fieldName === "wc" ||
                    fieldName === "living_rooms" ||
                    fieldName === "floor" ||
                    fieldName === "levels"
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
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="heating_system">
                        <Form.Label>{t("propertyDetails.heating_system.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="heating_system"
                            value={listingData.heating_system || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="autonomous">{t("propertyDetails.heating_system.autonomous")}</option>
                            <option value="central">{t("propertyDetails.heating_system.central")}</option>
                            <option value="air_condition">{t("propertyDetails.heating_system.air_condition")}</option>
                            <option value="fireplace">{t("propertyDetails.heating_system.fireplace")}</option>
                            <option value="solar">{t("propertyDetails.heating_system.solar")}</option>
                            <option value="geothermal">{t("propertyDetails.heating_system.geothermal")}</option>
                            <option value="other">{t("propertyDetails.heating_system.other")}</option>
                            <option value="n/a">{t("propertyDetails.heating_system.n/a")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.heating_system?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="power_type">
                        <Form.Label>{t("propertyDetails.powerType.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="power_type"
                            value={listingData.power_type || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="electricity">{t("propertyDetails.powerType.electricity")}</option>
                            <option value="gas">{t("propertyDetails.powerType.gas")}</option>
                            <option value="natural_gas">{t("propertyDetails.powerType.natural_gas")}</option>
                            <option value="heat_pump">{t("propertyDetails.powerType.heat_pump")}</option>
                            <option value="other">{t("propertyDetails.heating_system.other")}</option>
                            <option value="n/a">{t("propertyDetails.heating_system.n/a")}</option>
                        </Form.Control>
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
                    <Form.Group controlId="energy_class">
                        <Form.Label>{t("propertyDetails.energyClass")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="energy_class"
                            value={listingData.energy_class || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            {Array.from("ABCDEFG").map((letter) => (
                                <option key={letter}>{letter}</option>
                            ))}
                            <option value="to_be_issued">{t("propertyDetails.energyClassTypes.toBeIssued")}</option>
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
                    <Form.Group controlId="floor_type">
                        <Form.Label>{t("propertyDetails.floorTypes.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="floor_type"
                            value={listingData.floor_type || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="marble">{t("propertyDetails.floorTypes.marble")}</option>
                            <option value="tile">{t("propertyDetails.floorTypes.tile")}</option>
                            <option value="wooden">{t("propertyDetails.floorTypes.wooden")}</option>
                            <option value="granite">{t("propertyDetails.floorTypes.granite")}</option>
                            <option value="mosaic">{t("propertyDetails.floorTypes.mosaic")}</option>
                            <option value="stone">{t("propertyDetails.floorTypes.stone")}</option>
                            <option value="laminate">{t("propertyDetails.floorTypes.laminate")}</option>
                            <option value="parquet">{t("propertyDetails.floorTypes.parquet")}</option>
                            <option value="carpet">{t("propertyDetails.floorTypes.carpet")}</option>
                            <option value="cement">{t("propertyDetails.floorTypes.cement")}</option>
                            <option value="other">{t("propertyDetails.floorTypes.other")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.floor_type?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="type_of_glass">
                        <Form.Label>{t("propertyDetails.glassType.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="type_of_glass"
                            value={listingData.type_of_glass || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="single">{t("propertyDetails.glassType.single")}</option>
                            <option value="double">{t("propertyDetails.glassType.double")}</option>
                            <option value="triple">{t("propertyDetails.glassType.triple")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.type_of_glass?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="opening_frames">
                        <Form.Label>{t("propertyDetails.openingFrames.title")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="opening_frames"
                            value={listingData.opening_frames || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="aluminium">{t("propertyDetails.openingFrames.aluminium")}</option>
                            <option value="wooden">{t("propertyDetails.openingFrames.wooden")}</option>
                            <option value="PVC">{t("propertyDetails.openingFrames.pvc")}</option>
                            <option value="iron">{t("propertyDetails.openingFrames.iron")}</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.opening_frames?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="construction_year">
                        <Form.Label>{t("propertyDetails.yearBuilt")}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="construction_year"
                            value={listingData.construction_year || ""}
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
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="service_charge">
                        <Form.Label>{t("propertyDetails.serviceCharge")} {listingData.currency === "---" ? "" : listingData.currency}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="service_charge"
                            value={listingData.service_charge || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.service_charge?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <hr />
            <Row className="justify-content-center mt-4">
                <AmenitiesResidential
                    handleAmenityChange={handleAmenityChange}
                    selectedAmenities={selectedAmenities}
                    create={create}
                />
            </Row>
        </>
    );
};

export default ResidentialFields;