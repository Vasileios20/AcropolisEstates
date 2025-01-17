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
import Bedrooms from "./Bedrooms";
import YearBuilt from "./YearBuilt";
import HeatingSystem from "./HeatingSystem";

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
                <Modal.Body className={styles.ModalBody}>
                    <Row className="mb-3 align-items-center justify-content-around">
                        <Col xs={12} className="mb-1 d-flex align-items-center">
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
                    <Row className="g-1 align-items-center justify-content-start col-md-9">
                        <PriceSurface
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </Row>

                    <Row className="g-1 align-items-center justify-content-start col-md-9">
                        <Bedrooms filters={filters} setFilters={setFilters} />
                    </Row>

                    <Row className="g-1 align-items-center justify-content-start col-md-9">
                        <YearBuilt filters={filters} setFilters={setFilters} />
                    </Row>
                    <Row className="g-1 align-items-center justify-content-start">
                        <HeatingSystem filters={filters} setFilters={setFilters} handleChange={handleChange} />
                    </Row>

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
