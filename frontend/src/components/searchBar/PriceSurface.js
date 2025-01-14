import React from 'react';
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
    const priceOptions = [
        { value: "", label: t("searchBar.minPrice") },
        ...Array.from({ length: 20 }, (_, i) => ({ value: (i + 1) * 5000, label: (i + 1) * 5000 })),
        ...Array.from({ length: 9 }, (_, i) => ({ value: 100000 + (i + 1) * 50000, label: 100000 + (i + 1) * 50000 })),
        ...Array.from({ length: 10 }, (_, i) => ({ value: 500000 + (i + 1) * 100000, label: 500000 + (i + 1) * 100000 }))
    ];
    const maxPriceOptions = [
        { value: "", label: t("searchBar.maxPrice") },
        ...priceOptions.slice(1)
    ];

    const surfaceOptions = [
        { value: "", label: t("searchBar.minFloorArea") },
        ...Array.from({ length: 10 }, (_, i) => ({ value: (i + 1) * 10, label: (i + 1) * 10 })),
        ...Array.from({ length: 9 }, (_, i) => ({ value: 100 + (i + 1) * 50, label: 100 + (i + 1) * 50 })),
        ...Array.from({ length: 10 }, (_, i) => ({ value: 500 + (i + 1) * 100, label: 500 + (i + 1) * 100 }))
    ];

    const maxSurfaceOptions = [
        { value: "", label: t("searchBar.maxFloorArea") },
        ...surfaceOptions.slice(1)
    ];


    return (
        <Row className="g-1 align-items-center justify-content-evenly justify-content-lg-start ">
        
            <Col xs={12} sm={6} md={6} lg={4} className="text-start">
                <Form.Group controlId="formGroupPrice">
                    <Form.Label className="mb-0" style={{ fontWeight: "500" }}>
                        {t("searchBar.price")}
                    </Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                            {filters.price.min ? filters.price.min : t("searchBar.minPrice")} - {filters.price.max ? filters.price.max : t("searchBar.maxPrice")}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={`${styles.DropdownMenu} rounded`}>
                            <div className={`${styles.Dropdown} rounded`}>
                                <MainFieldsDropDown filters={filters} setFilters={setFilters} options={priceOptions} field="price" keyName="min" />
                                <MainFieldsDropDown filters={filters} setFilters={setFilters} options={maxPriceOptions} field="price" keyName="max" />
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={6} lg={4} className="text-start">
                <Form.Group controlId="formGroupSurface">
                    <Form.Label className="mb-0" style={{ fontWeight: "500" }}>
                        {filters.type === "land" ? t("searchBar.landArea") : t("searchBar.floorArea")}
                    </Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                            {filters.surface.min ? filters.surface.min : t("searchBar.minFloorArea")} - {filters.surface.max ? filters.surface.max : t("searchBar.maxFloorArea")}
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className={`${styles.DropdownMenu} rounded`}>
                            <div className={`${styles.Dropdown} rounded`}>
                                <MainFieldsDropDown filters={filters} setFilters={setFilters} options={surfaceOptions} field="surface" keyName="min" />
                                <MainFieldsDropDown filters={filters} setFilters={setFilters} options={maxSurfaceOptions} field="surface" keyName="max" />
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
            </Col>

        </Row>
    );
};

export default MainSearchFields;