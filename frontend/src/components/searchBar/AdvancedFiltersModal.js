import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { t } from "i18next";
import styles from "../../styles/SearchBar.module.css";
import btnStyles from "../../styles/Button.module.css";
import { SaleTypeSearch } from "./SaleTypeSearch";
import ButtonsAdvancedFilters from "./ButtonsAdvancedFilters";
import LocationType from "./LocationType";
import Price from "./Price";
import Surface from "./Surface";
import Bedrooms from "./Bedrooms";
import YearBuilt from "./YearBuilt";
import HeatingSystem from "./HeatingSystem";
import { useRouteFlags } from "contexts/RouteProvider";

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
    const { shortTermListing } = useRouteFlags();


    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await axiosReq.get("/amenities/");

                const filteredAmenities = response.data.results.filter(
                    (amenity) => [
                        "solar_water_heating", "parking", "elevator_in_building",
                        "double_glass", "balcony", "furnished", "garden",
                        "fireplace", "air_conditioning", "underfloor_heating",
                        "attic", "veranda", "balcony", "furnished", "renovated", "storage", "bright",
                        "pets_allowed", "satelite", "awnings",
                        "screens", "bbq", "swimming_pool", "gym", "playroom", "security_alarm", "security_door", "penthouse",
                        "CCTV", "night_electricity", "access_for_disabled", "need_renovation", "ev_charger", "loft", "propery_consideration",
                        "inside_the_settlement", "facade", "consierge", "auction", "under_construction"
                    ].includes(amenity.name)
                ).map((amenity) => ({
                    ...amenity,
                    name: amenity.name
                }));


                setAvailableAmenities(filteredAmenities); // Expecting an array
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
                    <Modal.Title>{t("searchBar.advancedFilters")}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.ModalBody}>
                    <Row className={shortTermListing ? "d-none" : "mb-3 align-items-center justify-content-around"}>
                        <Col xs={12} className="mb-1 d-flex align-items-center">
                            <SaleTypeSearch filters={filters} setFilters={setFilters} handleChange={handleChange} />
                        </Col>
                    </Row>
                    <Row className={shortTermListing ? "" : "g-1 align-items-center justify-content-start col-md-6"}>
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
                        <Price
                            filters={filters}
                            setFilters={setFilters}
                        />
                        <Surface
                            filters={filters}
                            setFilters={setFilters}
                        />

                    </Row>

                    <Row className="g-1 align-items-center justify-content-start col-md-9">
                        <Bedrooms filters={filters} setFilters={setFilters} />
                    </Row>

                    <Row className={shortTermListing ? "d-none" : "g-1 align-items-center justify-content-start col-md-9"}>
                        <YearBuilt filters={filters} setFilters={setFilters} />
                    </Row>
                    <Row className={shortTermListing ? "d-none" : "g-1 align-items-center justify-content-start col-md-9"}>
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
