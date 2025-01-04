import React, { useMemo, useEffect } from "react";
import { t } from "i18next";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useFetchLocationData from "../../hooks/useFetchLocationData";

const RegionCountyMunicipalitySelect = ({
    onRegionChange,
    onCountyChange,
    onMunicipalityChange,
    selectedRegion,
    selectedCounty,
    selectedMunicipality,
    listingData,
}) => {
    const { regionsData } = useFetchLocationData();

    // Update selected region, county, and municipality when listing data changes
    useEffect(() => {
        if (listingData.region_id && listingData.region_id !== selectedRegion) {
            onRegionChange(listingData.region_id);
        }
        if (listingData.county_id && listingData.county_id !== selectedCounty) {
            onCountyChange(listingData.county_id);
        }
        if (listingData.municipality_id && listingData.municipality_id !== selectedMunicipality) {
            onMunicipalityChange(listingData.municipality_id);
        }
    },
        [
            listingData.region_id,
            listingData.county_id,
            listingData.municipality_id,
            onRegionChange, onCountyChange,
            onMunicipalityChange,
            selectedRegion,
            selectedCounty,
            selectedMunicipality
        ]
    );

    const selectedRegionObj = useMemo(() => regionsData.find(region => region.id === selectedRegion), [regionsData, selectedRegion]);

    const counties = useMemo(() => selectedRegionObj?.counties || [], [selectedRegionObj]);

    const selectedCountyObj = useMemo(() => counties.find(county => county.id === selectedCounty), [counties, selectedCounty]);
    
    const municipalities = useMemo(() => selectedCountyObj?.municipalities || [], [selectedCountyObj]);

    return (
        <Row className="justify-content flex-column">
            {/* Region Dropdown */}
            <Col md={6} className="mb-2 mx-auto d-flex justify-content-between flex-column">
                <label htmlFor="region_id" className="mb-2">{t("regionOptions.region")}</label>
                <select
                    id="region_id"
                    value={selectedRegion}
                    name="region_id"
                    onChange={e => onRegionChange(parseInt(e.target.value))}
                    className="form-select"
                >
                    <option value="">{t("regionOptions.selectRegion")}</option>
                    {regionsData.map(region => (
                        <option key={region.id} value={region.id}>
                            {region.region}
                        </option>
                    ))}
                </select>
            </Col>

            {/* County Dropdown */}
            <Col md={6} className="mb-2 mx-auto d-flex justify-content-between flex-column">
                {selectedRegion && (
                    <>
                        <label htmlFor="county_id" className="mb-2">{t("regionOptions.county")}</label>
                        <select
                            id="county_id"
                            value={selectedCounty}
                            name="county_id"
                            onChange={e => onCountyChange(parseInt(e.target.value))}
                            className="form-select"
                        >
                            <option value="">{t("regionOptions.selectCounty")}</option>
                            {counties.map(county => (
                                <option key={county.id} value={county.id}>
                                    {county.county}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </Col>

            {/* Municipality Dropdown */}
            <Col md={6} className="mb-2 mx-auto d-flex justify-content-between flex-column">
                {selectedCounty && (
                    <>
                        <label htmlFor="municipality_id" className="mb-2">{t("regionOptions.municipality")}</label>
                        <select
                            id="municipality_id"
                            value={selectedMunicipality}
                            name="municipality_id"
                            onChange={e => onMunicipalityChange(parseInt(e.target.value))}
                            className="form-select"
                        >
                            <option value="">{t("regionOptions.selectMunicipality")}</option>
                            {municipalities.map(municipality => (
                                <option key={municipality.id} value={municipality.id}>
                                    {municipality.municipality}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </Col>
        </Row>
    );
};

export default RegionCountyMunicipalitySelect;
