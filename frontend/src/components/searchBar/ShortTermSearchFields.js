import React from 'react'

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Price from "./Price";
import DateRangePicker from "./DateRangePicker";
import { ButtonsSearch } from "./ButtonsSearch";
import MunicipalitySearch from 'components/searchBar/MunicipalitySearch';
import { Form } from 'react-bootstrap';
import { t } from 'i18next';
import styles from "../../styles/SearchBar.module.css";

const ShortTermFields = ({
    filters,
    setFilters,
    handleChange,
    handleMunicipalitySelect,
    regionsData,
    history,
    empty,
    setEmpty,
    update,
    onSearch,
}) => {
    return (
        <>
            <Row className="g-0 align-items-center justify-content-evenly">
                <Col xs={12} lg={3} xl={4} className="mb-1 pe-1">
                    <Form.Label style={{ fontWeight: "500" }} className={`${styles.Label} mb-0`}>
                        {t("searchBar.location")}
                    </Form.Label>
                    <MunicipalitySearch
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
                <Col xs={12} lg={9} xl={8} className="mb-1">
                    <Row className="g-1 align-items-center justify-content-around justify-content-lg-start">
                        <Price
                            filters={filters}
                            setFilters={setFilters}
                        />
                        <DateRangePicker
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            setFilters={setFilters}
                        />
                    </Row>
                </Col>
                <Col xs={12} lg={12} className="pt-3 d-flex align-items-center justify-content-lg-end">
                    <ButtonsSearch
                        filters={filters}
                        setFilters={setFilters}
                        update={update}
                    />
                </Col>

            </Row>
        </>
    )
}

export default ShortTermFields;