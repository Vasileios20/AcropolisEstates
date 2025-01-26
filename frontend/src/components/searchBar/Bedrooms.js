import React, { useState } from 'react';
import { t } from 'i18next';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import { MainFieldsDropDown } from './CustomDropDown';
import styles from '../../styles/SearchBar.module.css';

const Bedrooms = ({
    filters,
    setFilters
}) => {
    const [show, setShow] = useState(false);
    const bedroomsOptions = [
        { value: "", label: t("searchBar.from") },
        ...Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: i + 1 }))
    ];
    const maxBedroomOptions = [
        { value: "", label: t("searchBar.to") },
        ...bedroomsOptions.slice(1)
    ];

    return (
        <Row className="g-1 align-items-center justify-content-evenly justify-content-lg-start">
            <Col className="text-start">
                <Form.Group controlId="formGroupbedroom">
                    <Form.Label className={`${styles.Label} mb-0`} style={{ fontWeight: "500" }}>
                        {t("propertyDetails.bedrooms")}
                    </Form.Label>
                    <Row className="g-1">
                        <Col xs={12} sm={6} md={6}>
                            <Dropdown onToggle={() => setShow(!show)}>
                                <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                                    {filters.bedrooms.min ? `${t("searchBar.from")} ${filters.bedrooms.min}` : `${t("searchBar.from")}`}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={`${styles.DropdownMenu} rounded`}>
                                    <div className={`${styles.Dropdown} rounded`}>
                                        <MainFieldsDropDown filters={filters} setFilters={setFilters} options={bedroomsOptions} field="bedrooms" keyName="min" show={show} setShow={setShow} />
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs={12} sm={6} md={6}>
                            <Dropdown onToggle={() => setShow(!show)}>
                                <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                                    {filters.bedrooms.max ? `${t("searchBar.to")} ${filters.bedrooms.max}` : `${t("searchBar.to")}`}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className={`${styles.DropdownMenu} rounded`}>
                                    <div className={`${styles.Dropdown} rounded`}>
                                        <MainFieldsDropDown filters={filters} setFilters={setFilters} options={maxBedroomOptions} field="bedrooms" keyName="max" show={show} setShow={setShow} />
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Form.Group>
            </Col>
        </Row>
    );
};

export default Bedrooms;