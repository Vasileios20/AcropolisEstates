import React, { useState } from 'react';

import { t } from 'i18next';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';

import { MainFieldsDropDown } from './CustomDropDown';

import styles from '../../styles/SearchBar.module.css';

import { useRouteFlags } from 'contexts/RouteProvider';

const Price = ({
    filters,
    setFilters
}) => {
    const { shortTermListing } = useRouteFlags();
    const [show, setShow] = useState(false);

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

    const shortTermPriceOptions = [
        { value: "", label: t("searchBar.minPrice") },
        ...Array.from({ length: 20 }, (_, i) => ({ value: (i + 1) * 50, label: (i + 1) * 50 })),
        ...Array.from({ length: 9 }, (_, i) => ({ value: 1000 + (i + 1) * 500, label: 1000 + (i + 1) * 500 })),
        ...Array.from({ length: 10 }, (_, i) => ({ value: 5000 + (i + 1) * 1000, label: 5000 + (i + 1) * 1000 }))
    ];

    const maxShortTermPriceOptions = [
        { value: "", label: t("searchBar.maxPrice") },
        ...shortTermPriceOptions.slice(1)
    ];

    const priceMin = parseInt(String(filters?.price?.min)).toLocaleString("de-DE", { useGrouping: true });
    const priceMax = parseInt(String(filters?.price?.max)).toLocaleString("de-DE", { useGrouping: true });
    const priceOptionsToUse = { shortTermListing } ? shortTermPriceOptions : priceOptions;
    const maxPriceOptionsToUse = { shortTermListing } ? maxShortTermPriceOptions : maxPriceOptions;

    return (
        <Col xs={12} sm={6} className="text-start">
            <Form.Group controlId="formGroupPrice">
                <Form.Label className={`${styles.Label} mb-0`} style={{ fontWeight: "500" }}>
                    {t("searchBar.price")}
                </Form.Label>
                <Row className="g-1">
                    <Col xs={12} sm={6} md={6}>

                        <Dropdown onToggle={() => setShow(!show)}>
                            <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                                {filters.price.min && filters.price.max ? `€ ${priceMin}` : filters.price.min ? `€ ${t("searchBar.from")} ${priceMin}` : `€ ${t("searchBar.from")}`}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className={`${styles.DropdownMenu} rounded`}>

                                <div className={`${styles.Dropdown} rounded`}>
                                    <MainFieldsDropDown filters={filters} setFilters={setFilters} options={priceOptionsToUse} field="price" keyName="min" show={show} setShow={setShow} />
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                        <Dropdown onToggle={() => setShow(!show)}>
                            <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                                {filters.price.min && filters.price.max ? `€ ${priceMax}` : filters.price.max ? `€ ${t("searchBar.to")} ${priceMax}` : `€ ${t("searchBar.to")}`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className={`${styles.DropdownMenu} rounded`}>
                                <div className={`${styles.Dropdown} rounded`}>
                                    <MainFieldsDropDown filters={filters} setFilters={setFilters} options={maxPriceOptionsToUse} field="price" keyName="max" show={show} setShow={setShow} />
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Form.Group>
        </Col>

    );
};

export default Price;