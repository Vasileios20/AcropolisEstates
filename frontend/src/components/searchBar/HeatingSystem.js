import React from "react";
import { t } from "i18next";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../../styles/SearchBar.module.css";
import { CustomDropDown } from "./CustomDropDown";


const HeatingSystem = ({ filters, setFilters, handleChange }) => {
    const options = [
        { value: "", label: t("listingType.any") },
        { value: "autonomous", label: t("propertyDetails.heating_system.autonomous") },
        { value: "central", label: t("propertyDetails.heating_system.central") },
        { value: "air_condition", label: t("propertyDetails.heating_system.air_condition") },
        { value: "fireplace", label: t("propertyDetails.heating_system.fireplace") },
        { value: "solar", label: t("propertyDetails.heating_system.solar") },
        { value: "geothermal", label: t("propertyDetails.heating_system.geothermal") },
        { value: "other", label: t("propertyDetails.heating_system.other") },
        { value: "n/a", label: t("propertyDetails.heating_system.n/a") }
    ];

    const type = filters?.heatingSystem
    const multiType = type ? t("listingType." + type) : "";
    const heatingSystemCapitalized = multiType?.replace(/\b\w/g, char => char.toUpperCase());

    return (
        <Row className="g-1 align-items-center justify-content-start my-3">
            <Col xs={12} sm={6} className="text-start">
            <Form.Label className={`${styles.Label} mb-0`} style={{ fontWeight: "500" }}>{t("propertyDetails.heating_system.title")}</Form.Label>
                <CustomDropDown filters={filters} setFilters={setFilters} options={options} labelCapitalized={heatingSystemCapitalized} />
            </Col>
        </Row>
    );
};

export default HeatingSystem;