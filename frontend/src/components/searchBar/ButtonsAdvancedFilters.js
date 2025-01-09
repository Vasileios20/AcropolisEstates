import React from 'react'
import Button from 'react-bootstrap/Button'
import { t } from 'i18next'
import btnStyles from '../../styles/Button.module.css'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

export const ButtonsAdvancedFilters = ({ filters, setFilters, update, handleApply }) => {
    const renderTooltip = (props) => (
        <Tooltip id="tooltip-disabled" {...props}>
            Please choose rent or buy.
        </Tooltip>
    );

    return (
        <>
            <Button
                className={`${btnStyles.Button} ${btnStyles.Remove} me-1`}
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
            {!filters.saleType ? (
                <>
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 50, hide: 300 }}
                        overlay={renderTooltip}
                    >
                        <span className="d-inline-block">
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.AngryOcean} ${btnStyles.SearchBtn}`}
                                style={!filters.saleType && { pointerEvents: 'none', backgroundColor: '#4d6765' }}
                                onClick={(e) => handleApply(e)}
                                disabled={!filters.saleType}
                            >
                                {update ? t("searchBar.btnUpdate") : t("searchBar.btnSearch")}
                            </Button>
                        </span>
                    </OverlayTrigger>

                </>
            ) : (
                <Button className={`${btnStyles.Button} ${btnStyles.AngryOcean} ${btnStyles.SearchBtn}`} onClick={(e) => handleApply(e)} >
                    {update ? t("searchBar.btnUpdate") : t("searchBar.btnSearch")}
                </Button>
            )}
        </>
    )
}

export default ButtonsAdvancedFilters
