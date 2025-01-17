import React from 'react';
import { t } from 'i18next';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MunicipalitySearch from './MunicipalitySearch';
import { CustomDropDown } from './CustomDropDown';
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
    const type = filters?.type
    const multiType = type ? t("listingType." + type) : ""; 
    const typeCapitalized = multiType?.replace(/\b\w/g, char => char.toUpperCase());

    const options = [
        { value: "", label: t("listingType.any") },
        { value: "residential", label: t("listingType.residential") },
        { value: "land", label: t("listingType.land") },
        { value: "commercial", label: t("listingType.commercial") },
    ];

    return (
        <>
            <Row className="g-1 align-items-center justify-content-evenly">
                <Col xs={12} sm={6} md={9} className="text-start">
                    <Form.Label style={{ fontWeight: "500" }} className={`${styles.Label} mb-0`}>
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
                <Col xs={12} sm={6} md={3} className="text-start">
                    <Form.Label style={{ fontWeight: "500" }} className={`${styles.Label} mb-0`}>
                        {t("searchBar.type")}
                    </Form.Label>
                    <CustomDropDown filters={filters} setFilters={setFilters} options={options} labelCapitalized={typeCapitalized} />
                </Col>
            </Row>

        </>
    );
};

export default MainSearchFields;