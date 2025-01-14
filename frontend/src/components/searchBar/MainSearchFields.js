import React from 'react';
import { t } from 'i18next';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import MunicipalitySearch from './MunicipalitySearch';
import { MainFieldsDropDown, TypeDropDown } from './CustomDropDown';
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
            <Col xs={8} md={3}>
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
            <Col xs={4} md={3} lg={2}>
                <Form.Label style={{ fontWeight: "500" }} className="mb-0">
                    {t("searchBar.type")}
                </Form.Label>
                <TypeDropDown filters={filters} setFilters={setFilters} />
            </Col>

            <Col xs={12} sm={6} md={3} lg={2} className="text-start d-none d-md-block">
                <Form.Group controlId="formGroupPrice">
                    <Form.Label className="mb-0" style={{ fontWeight: "500" }}>
                        {t("searchBar.price")}
                    </Form.Label>
                    <Dropdown className={`${styles.SearchInput} w-100`}>
                        <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                            {filters.price.min ? filters.price.min : t("searchBar.minPrice")} - {filters.price.max ? filters.price.max : t("searchBar.maxPrice")}
                        </Dropdown.Toggle>
                        <Dropdown.Menu >
                            <div className={styles.Dropdown}>
                                <MainFieldsDropDown filters={filters} setFilters={setFilters} options={priceOptions} field="price" keyName="min" />
                                <MainFieldsDropDown filters={filters} setFilters={setFilters} options={maxPriceOptions} field="price" keyName="max" />
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={3} lg={2} className="text-start d-none d-md-block">
                <Form.Group controlId="formGroupSurface">
                    <Form.Label className="mb-0" style={{ fontWeight: "500" }}>
                        {filters.type === "land" ? t("searchBar.landArea") : t("searchBar.floorArea")}
                    </Form.Label>
                    <Dropdown className={`${styles.SearchInput} w-100`}>
                        <Dropdown.Toggle className={`${styles.Select} w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic">
                            {filters.surface.min ? filters.surface.min : t("searchBar.minFloorArea")} - {filters.surface.max ? filters.surface.max : t("searchBar.maxFloorArea")}
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            <div className={styles.Dropdown}>
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