import React from 'react'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { t } from 'i18next'
import btnStyles from '../../styles/Button.module.css'

export const SaleTypeSearch = ({ filters, setFilters, handleChange }) => {
    return (
        <Col xs={6} className="mb-1 d-flex align-items-center">

            <Button
                className={filters?.saleType === "rent" ? `${btnStyles.AngryOcean} ${btnStyles.Button} me-2` : `${btnStyles.AngryOceanOutline} ${btnStyles.Button} me-2`}
                onClick={() => handleChange({ target: { name: "saleType", value: "rent" } })}
            >
                {t("searchBar.rent")}
            </Button>
            <Button
                className={filters.saleType === "sale" ? `${btnStyles.AngryOcean}  ${btnStyles.Button}` : `${btnStyles.AngryOceanOutline} ${btnStyles.Button}`}
                onClick={() => handleChange({ target: { name: "saleType", value: "sale" } })}
            >
                {t("searchBar.buy")}
            </Button>

        </Col>
    )
}
