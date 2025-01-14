import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { t } from "i18next";
import styles from "../../styles/SearchBar.module.css";
import btnStyles from "../../styles/Button.module.css";
import { SaleTypeSearch } from "./SaleTypeSearch";
import ButtonsAdvancedFilters from "./ButtonsAdvancedFilters";
import LocationType from "./LocationType";
import PriceSurface from "./PriceSurface";

const AdvancedFiltersModal = ({
    filters,
    setFilters,
    onApplyFilters,
    handleSubmit,
    update,
    empty,
    setEmpty,
    regionsData,
    history,
    handleMunicipalitySelect,
}) => {
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
            <i className={`${styles.AdvancedFiltersModal} fa-solid fa-sliders`} onClick={() => setShow(true)}></i>

            <Modal show={show} onHide={() => setShow(false)} size="xl" fullscreen="lg-down" style={{ fontSize: "0.8rem" }}>
                <Modal.Header closeButton>
                    <Modal.Title>Advanced Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-3 align-items-center justify-content-around">
                        <Col xs={6} className="mb-1 d-flex align-items-center">
                            <SaleTypeSearch filters={filters} setFilters={setFilters} handleChange={handleChange} />
                        </Col>
                        <Col xs={4} className="mb-1 d-none d-lg-block ms-auto">
                            <ButtonsAdvancedFilters filters={filters} setFilters={setFilters} update={update} handleApply={handleApply} />
                        </Col>
                    </Row>
                    <Row className="g-1 align-items-center justify-content-start col-md-6">
                        <LocationType
                            filters={filters}
                            setFilters={setFilters}
                            onSearch={handleMunicipalitySelect}
                            regionsData={regionsData}
                            history={history}
                            empty={empty}
                            setEmpty={setEmpty}
                            handleChange={handleChange}
                        />
                    </Row>
                    <Row className="g-1 align-items-center justify-content-start col-md-6 col-lg-9">
                        <PriceSurface
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </Row>

                    <Form.Group as={Row} className="my-3">
                        <Form.Label column sm={2} style={{ fontWeight: "500" }}>
                            {t("propertyDetails.bedrooms")}
                        </Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                className={styles.SearchInput}
                                type="number"
                                placeholder={t("searchBar.minBedrooms")}
                                name="min"
                                value={filters?.bedrooms.min || ""}
                                onChange={(e) => handleRangeChange(e, "bedrooms")}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                className={styles.SearchInput}
                                type="number"
                                placeholder={t("searchBar.maxBedrooms")}
                                name="max"
                                value={filters?.bedrooms.max || ""}
                                onChange={(e) => handleRangeChange(e, "bedrooms")}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2} style={{ fontWeight: "500" }}>
                            {t("propertyDetails.yearBuilt")}
                        </Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                className={styles.SearchInput}
                                type="number"
                                placeholder={t("searchBar.minYearBuilt")}
                                name="min"
                                value={filters?.constructionYear.min || ""}
                                onChange={(e) => handleRangeChange(e, "constructionYear")}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                className={styles.SearchInput}
                                type="number"
                                placeholder={t("searchBar.maxYearBuilt")}
                                name="max"
                                value={filters?.constructionYear.max || ""}
                                onChange={(e) => handleRangeChange(e, "constructionYear")}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2} style={{ fontWeight: "500" }}>
                            {t("propertyDetails.floor")}
                        </Form.Label>
                        <Col sm={5}>
                            <Form.Control
                                className={styles.SearchInput}
                                type="number"
                                placeholder={t("searchBar.minFloor")}
                                name="min"
                                value={filters?.floor?.min || ""}
                                onChange={(e) => handleRangeChange(e, "floor")}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                className={styles.SearchInput}
                                type="number"
                                placeholder={t("searchBar.maxFloor")}
                                name="max"
                                value={filters?.floor?.max || ""}
                                onChange={(e) => handleRangeChange(e, "floor")}
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2} style={{ fontWeight: "500" }}>{t("propertyDetails.heating_system.title")}</Form.Label>
                        <Col md={5}>
                            <Form.Control
                                className={styles.SearchInput}
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
                    <ButtonsAdvancedFilters filters={filters} setFilters={setFilters} update={update} handleApply={handleApply} />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdvancedFiltersModal;
