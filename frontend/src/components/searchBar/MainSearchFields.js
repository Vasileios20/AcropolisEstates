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

    return (
        <>
            <Col sm={6} md={3} className="my-1 my-md-0">
                <Form.Label style={{ fontWeight: "500" }}>
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
            <Col sm={6} md={2} className="mt-1 mt-md-0">
                <Form.Label style={{ fontWeight: "500" }}>
                    {t("searchBar.type")}
                </Form.Label>
                <TypeDropDown filters={filters} setFilters={setFilters} />
            </Col>

            <Col lg={2} md={3} sm={6} className="mb-1">
                <Form.Group as={Row} controlId="formGroupPrice">
                    <Form.Label column className="mb-0" style={{ fontWeight: "500" }}>
                        {t("searchBar.price")}
                    </Form.Label>
                    <Col sm={12} className="d-flex align-items-center">
                        <Form.Control
                            className={styles.SearchInput}
                            aria-label="min price"
                            type="number"
                            placeholder={t("searchBar.minPrice")}
                            min="0"
                            value={filters.price.min ? filters.price.min : ""}
                            onChange={(e) => handleChange(e)}
                        />
                        <Form.Control
                            className={styles.SearchInput}
                            aria-label="max price"
                            type="number"
                            placeholder={t("searchBar.maxPrice")}
                            min={filters.price.min ? filters.price.min : "0"}
                            max="10000000"
                            value={filters.price.max ? filters.price.max : ""}
                            onChange={(e) => handleChange(e)}
                        />
                    </Col>
                </Form.Group>
            </Col>
            <Col lg={2} md={3} sm={6} className="mb-2">
                <Form.Group as={Row} controlId="formGroupSurface">
                    <Form.Label column className="mb-0" style={{ fontWeight: "500" }}>
                        {filters.type === "land" ? t("searchBar.landArea") : t("searchBar.floorArea")}
                    </Form.Label>
                    <Col sm={12} className="d-flex align-items-center">
                        <Form.Control
                            className={styles.SearchInput}
                            aria-label="min surface"
                            type="number"
                            placeholder={t("searchBar.minFloorArea")}
                            min="0"
                            value={filters.surface.min ? filters.surface.min : ""}
                            onChange={(e) => handleChange(e)}
                        />
                        <Form.Control
                            className={styles.SearchInput}
                            aria-label="max surface"
                            type="number"
                            placeholder={t("searchBar.maxFloorArea")}
                            min={filters.surface.min ? filters.surface.min : "0"}
                            max="1000000"
                            value={filters.surface.max ? filters.surface.max : ""}
                            onChange={(e) => handleChange(e)}
                        />
                    </Col>
                </Form.Group>
            </Col>
        </>
    );
};

export default MainSearchFields;