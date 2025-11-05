import React, { useState } from 'react';

import { t } from 'i18next';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';

import { MainFieldsDropDown } from './CustomDropDown';

import styles from '../../styles/SearchBar.module.css';

const MainSearchFields = ({
    filters,
    setFilters
}) => {
    const [show, setShow] = useState(false);

    const surfaceOptions = [
        { value: "", label: `${t("searchBar.minFloorArea")} ${t("searchBar.sqm")}` },
        ...Array.from({ length: 10 }, (_, i) => ({ value: (i + 1) * 10, label: (i + 1) * 10 })),
        ...Array.from({ length: 9 }, (_, i) => ({ value: 100 + (i + 1) * 50, label: 100 + (i + 1) * 50 })),
        ...Array.from({ length: 10 }, (_, i) => ({ value: 500 + (i + 1) * 100, label: 500 + (i + 1) * 100 }))
    ];

    const maxSurfaceOptions = [
        { value: "", label: `${t("searchBar.maxFloorArea")} ${t("searchBar.sqm")}` },
        ...surfaceOptions.slice(1)
    ];

    const surfaceMin = parseInt(String(filters?.surface?.min)).toLocaleString("de-DE", { useGrouping: true });
    const surfaceMax = parseInt(String(filters?.surface?.max)).toLocaleString("de-DE", { useGrouping: true });

    return (
        <Col xs={12} sm={6} className="text-start">
            <Form.Group controlId="formGroupSurface">
                <Form.Label className={`${styles.Label} mb-0`} style={{ fontWeight: "500" }}>
                    {filters.type === "land" ? t("searchBar.landArea") : t("searchBar.floorArea")}
                </Form.Label>
                <Row className="g-1">
                    <Col xs={12} sm={6} md={6}>
                        <Dropdown onToggle={() => setShow(!show)}>
                            <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                                {filters.surface.min && filters.surface.max ? `${surfaceMin} ${t("searchBar.sqm")}` : filters.surface.min ? `${t("searchBar.from")} ${surfaceMin} ${t("searchBar.sqm")}` : `${t("searchBar.from")}`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className={`${styles.DropdownMenu} rounded`}>
                                <div className={`${styles.Dropdown} rounded`}>
                                    <MainFieldsDropDown filters={filters} setFilters={setFilters} options={surfaceOptions} field="surface" keyName="min" show={show} setShow={setShow} />
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                        <Dropdown onToggle={() => setShow(!show)}>
                            <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                                {filters.surface.min && filters.surface.max ? `${surfaceMax} ${t("searchBar.sqm")}` : filters.surface.max ? `${t("searchBar.to")} ${surfaceMax} ${t("searchBar.sqm")}` : `${t("searchBar.to")}`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className={`${styles.DropdownMenu} rounded`}>
                                <div className={`${styles.Dropdown} rounded`}>
                                    <MainFieldsDropDown filters={filters} setFilters={setFilters} options={maxSurfaceOptions} field="surface" keyName="max" show={show} setShow={setShow} />
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Form.Group>
        </Col>

    );
};

export default MainSearchFields;