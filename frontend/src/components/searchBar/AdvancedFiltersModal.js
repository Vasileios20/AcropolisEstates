import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { t } from "i18next";
import styles from "../../styles/SearchBar.module.css";
import btnStyles from "../../styles/Button.module.css";

const AdvancedFiltersModal = ({ filters, setFilters, onApplyFilters, handleSubmit, update }) => {
    const [show, setShow] = useState(false);
    const [availableAmenities, setAvailableAmenities] = useState([]);

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await axiosReq.get("/amenities/");

                const filteredAmenities = response.data.results.filter(
                    (amenity) => [
                        "parking", "elevator_in_building", "solar_water_heating",
                        "double_glazed_windows", "balcony", "furnished", "garden",
                        "fireplace", "air_conditioning", "underfloor_heating",
                        "storage_room", "swimming_pool", "central_heating",
                        "renovated", "alarm", "security_door", "penthouse",
                        "luxury", "studio", "loft", "ground_floor", "investment",
                    ].includes(amenity.name)
                ).map((amenity) => ({
                    ...amenity,
                    name: amenity.name
                }));

                setAvailableAmenities(response.data.results); // Expecting an array
            } catch (error) {
                console.error("Error fetching amenities:", error);
                setAvailableAmenities([]); // Prevent map issues
            }
        };

        fetchAmenities();
    }, []);

    const handleAmenityChange = (e, amenityId) => {
        const { checked } = e.target;
        setFilters((prevFilters) => {
            const updatedAmenities = checked
                ? [...prevFilters.amenities, String(amenityId)]
                : prevFilters.amenities.filter((id) => id !== String(amenityId));

            return {
                ...prevFilters,
                amenities: updatedAmenities,
            };
        });
    };

    const handleRangeChange = (e, field) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: {
                ...prevFilters[field],
                [name]: value,
            },
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleApply = (e) => {
        onApplyFilters(filters);
        handleSubmit(e);
        setShow(false);
    };

    return (
        <>
            <i className={`${styles.AdvancedFiltersModal} fas fa-bars ms-auto`} onClick={() => setShow(true)}></i>

            <Modal show={show} onHide={() => setShow(false)} size="xl" fullscreen="md-down">
                <Modal.Header closeButton>
                    <Modal.Title>Advanced Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            {t("propertyDetails.bedrooms")}
                        </Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder={t("searchBar.minBedrooms")}
                                name="min"
                                value={filters?.bedrooms.min || ""}
                                onChange={(e) => handleRangeChange(e, "bedrooms")}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder={t("searchBar.maxBedrooms")}
                                name="max"
                                value={filters?.bedrooms.max || ""}
                                onChange={(e) => handleRangeChange(e, "bedrooms")}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            {t("propertyDetails.yearBuilt")}
                        </Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder={t("searchBar.minYearBuilt")}
                                name="min"
                                value={filters?.constructionYear.min || ""}
                                onChange={(e) => handleRangeChange(e, "constructionYear")}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder={t("searchBar.maxYearBuilt")}
                                name="max"
                                value={filters?.constructionYear.max || ""}
                                onChange={(e) => handleRangeChange(e, "constructionYear")}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            {t("propertyDetails.floor")}
                        </Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder={t("searchBar.minFloor")}
                                name="min"
                                value={filters?.floor?.min || ""}
                                onChange={(e) => handleRangeChange(e, "floor")}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                type="number"
                                placeholder={t("searchBar.maxFloor")}
                                name="max"
                                value={filters?.floor?.max || ""}
                                onChange={(e) => handleRangeChange(e, "floor")}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>{t("propertyDetails.heating_system.title")}</Form.Label>
                        <Col md={5}>
                            <Form.Control
                                className={styles.Input}
                                as="select"
                                name="heating_system"
                                value={filters?.heating_system || ""}
                                onChange={handleChange}
                            >
                                <option value="">---</option>
                                <option value="autonomous">{t("propertyDetails.heating_system.autonomous")}</option>
                                <option value="central">{t("propertyDetails.heating_system.central")}</option>
                                <option value="air_condition">{t("propertyDetails.heating_system.air_condition")}</option>
                                <option value="fireplace">{t("propertyDetails.heating_system.fireplace")}</option>
                                <option value="solar">{t("propertyDetails.heating_system.solar")}</option>
                                <option value="geothermal">{t("propertyDetails.heating_system.geothermal")}</option>
                                <option value="other">{t("propertyDetails.heating_system.other")}</option>
                                <option value="n/a">{t("propertyDetails.heating_system.n/a")}</option>
                            </Form.Control>
                        </Col>
                    </Form.Group>

                    <h5>{t("searchBar.amenities")}</h5>
                    <Form.Group>
                        <Form.Label>{t("searchBar.selectAmenities")}</Form.Label>
                        <Row>
                            {availableAmenities.map((amenity, index) => (
                                <Col sm={4} key={amenity.id}>
                                    <Form.Check
                                        className={styles.AmenityCheckbox}
                                        type="checkbox"
                                        label={t("amenities." + amenity.name)}
                                        value={amenity.id || ""}
                                        checked={filters.amenities.includes(String(amenity.id))}
                                        onChange={(e) => handleAmenityChange(e, amenity.id)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={`${btnStyles.Olive} ${btnStyles.Button} me-auto`} variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button
                        className={`${btnStyles.Button} ${btnStyles.Remove}`}
                        onClick={() => {
                            setFilters({
                                amenities: [],
                                bedrooms: {},
                                constructionYear: {},
                                floor: "",
                            });
                        }}>
                        {t("searchBar.btnClear")}
                    </Button>
                    <Button className={`${btnStyles.Button} ${btnStyles.AngryOcean} ${btnStyles.SearchBtn}`} onClick={(e) => handleApply(e)} >
                        {update ? t("searchBar.btnUpdate") : t("searchBar.btnSearch")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdvancedFiltersModal;
