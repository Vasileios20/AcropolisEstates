import React from 'react';
import { t } from 'i18next';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MunicipalitySearch from './MunicipalitySearch';
import TypeDropDown from './TypeDropDown';
import styles from '../../styles/SearchBar.module.css';

const MainSearchFields = ({
    filters,
    setFilters,
    onSearch,
    regionsData,
    history,
    empty,
    setEmpty,
    handleChange
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
        <Row className="g-2 align-items-center justify-content-evenly">
            <Col xs={12} sm={6} md={3}>
                <Form.Label style={{ fontWeight: "500" }} className="mb-0">
                    {t("searchBar.location")}
                </Form.Label>
                <MunicipalitySearch
                    className={styles.SearchInput}
                    onSearch={onSearch}
                    regionsData={regionsData}
                    history={history}
                    saleType={filters.saleType}
                    empty={empty}
                    setEmpty={setEmpty}
                    filters={filters}
                    setFilters={setFilters}
                />
            </Col>
            <Col xs={12} sm={6} md={3} className="">
                <Form.Label style={{ fontWeight: "500" }} className="mb-0 ps-lg-2 ps-xl-4">
                    {t("searchBar.type")}
                </Form.Label>
                <TypeDropDown filters={filters} setFilters={setFilters} />
            </Col>

            <Col xs={12} sm={6} md={3} >
                <Form.Group controlId="formGroupPrice">
                    <Form.Label className="mb-0" style={{ fontWeight: "500" }}>
                        {t("searchBar.price")}
                    </Form.Label>
                    <Row className="g-2">
                        <Col xs={6}>
                            <Form.Control
                                as="select"
                                className={styles.SearchInput}
                                aria-label="min price"
                                value={filters.price.min ? filters.price.min : ""}
                                onChange={(e) => setFilters({ ...filters, price: { ...filters.price, min: e.target.value } })}
                            >
                                {priceOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col xs={6}>
                            <Form.Control
                                as="select"
                                className={styles.SearchInput}
                                aria-label="max price"
                                value={filters.price.max ? filters.price.max : ""}
                                onChange={(e) => setFilters({ ...filters, price: { ...filters.price, max: e.target.value } })}
                            >
                                {maxPriceOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Row>
                </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={3} >
                <Form.Group controlId="formGroupSurface">
                    <Form.Label className="mb-0" style={{ fontWeight: "500" }}>
                        {filters.type === "land" ? t("searchBar.landArea") : t("searchBar.floorArea")}
                    </Form.Label>
                    <Row className="g-2">
                        <Col xs={6}>
                            <Form.Control
                                as="select"
                                className={styles.SearchInput}
                                aria-label="min surface"
                                value={filters.surface.min ? filters.surface.min : ""}
                                onChange={(e) => setFilters({ ...filters, surface: { ...filters.surface, min: e.target.value } })}
                            >
                                {surfaceOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col xs={6}>
                            <Form.Control
                                as="select"
                                className={styles.SearchInput}
                                aria-label="max surface"
                                min={filters.surface.min ? filters.surface.min : "0"}
                                value={filters.surface.max ? filters.surface.max : ""}
                                onChange={(e) => setFilters({ ...filters, surface: { ...filters.surface, max: e.target.value } })}
                            >
                                {maxSurfaceOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                    </Row>
                </Form.Group>
            </Col>
        </Row>
    );
};

export default MainSearchFields;