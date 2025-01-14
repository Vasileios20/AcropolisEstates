import React from 'react';
import { t } from 'i18next';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MunicipalitySearch from './MunicipalitySearch';
import { TypeDropDown } from './CustomDropDown';
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
            <Row className="g-1 align-items-center justify-content-evenly">
                <Col xs={12} sm={6} md={6} className="text-start">
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
                <Col xs={12} sm={6} md={6} className="text-start">
                    <Form.Label style={{ fontWeight: "500" }} className="mb-0">
                        {t("searchBar.type")}
                    </Form.Label>
                    <TypeDropDown filters={filters} setFilters={setFilters} />
                </Col>
            </Row>

        </>
    );
};

export default MainSearchFields;