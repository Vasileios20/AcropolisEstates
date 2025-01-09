import React from 'react'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { t } from 'i18next'

import btnStyles from '../../styles/Button.module.css'


export const ButtonsSearch = ({ filters, setFilters, update }) => {
    const renderTooltip = (props) => (
        <Tooltip id="tooltip-disabled" {...props}>
            Please choose rent or buy.
        </Tooltip>
    );
    return (
        <Col xs={12} lg={3} className="mt-0 mt-md-1 mt-lg-4">
            {!filters.saleType ? (
                <>
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 50, hide: 300 }}
                        overlay={renderTooltip}
                    >
                        <span className="d-inline-block">
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.AngryOcean} ${btnStyles.SearchBtn} me-2`}
                                type="submit"
                                style={{ pointerEvents: 'none' }}
                            >
                                {update ? t("searchBar.btnUpdate") : t("searchBar.btnSearch")}
                            </Button>
                        </span>
                    </OverlayTrigger>
                    <Button
                        className={`${btnStyles.Button} ${btnStyles.Remove}`}
                        onClick={() => {
                            setFilters({
                                saleType: "",
                                type: "",
                                price: { min: "", max: "" },
                                surface: { min: "", max: "" },
                                regionId: "",
                                countyId: "",
                                municipalityId: "",
                                amenities: [],
                                bedrooms: { min: "", max: "" },
                                constructionYear: { min: "", max: "" },
                                floor: { min: "", max: "" },
                            });
                        }}>
                        {t("searchBar.btnClear")}
                    </Button>

                </>
            ) : (
                <>
                    <Button
                        className={`${btnStyles.Button} ${btnStyles.AngryOcean} ${btnStyles.SearchBtn} me-2`}
                        type="submit"
                    >
                        {update ? t("searchBar.btnUpdate") : t("searchBar.btnSearch")}
                    </Button>
                    <Button
                        className={`${btnStyles.Button} ${btnStyles.Remove}`}
                        onClick={() => {
                            setFilters({
                                saleType: "",
                                type: "",
                                price: { min: "", max: "" },
                                surface: { min: "", max: "" },
                                regionId: "",
                                countyId: "",
                                municipalityId: "",
                                amenities: [],
                                bedrooms: { min: "", max: "" },
                                constructionYear: { min: "", max: "" },
                                floor: { min: "", max: "" },
                            });
                        }}>
                        {t("searchBar.btnClear")}
                    </Button>
                </>
            )}
        </Col>
    )
}
