import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useFetchLocationData from "../../hooks/useFetchLocationData";
import styles from "../../styles/RegionCountyMunicipality.module.css";

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
    const { t, i18n } = useTranslation();
    const lng = i18n?.language;

    const [searchInput, setSearchInput] = useState("");
    const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
    const [showMunicipalityDropdown, setShowMunicipalityDropdown] = useState(false);

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

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        // Filter municipalities based on input
        if (value) {
            const filtered = municipalities.filter(municipality =>
                municipality.greekName.toLowerCase().includes(value.toLowerCase()) ||
                municipality.englishName.toLowerCase().includes(value.toLowerCase())
                
            );
            setFilteredMunicipalities(filtered);
            setShowMunicipalityDropdown(true);
        } else {
            setFilteredMunicipalities([]);
            setShowMunicipalityDropdown(false);
        }
    };

    const handleMunicipalitySelect = (municipality) => {
        onMunicipalityChange(municipality.id);
        console.log('municipality:', municipality);
        const name = lng === "el" ? municipality.greekName : municipality.englishName;
        
        setSearchInput(name); // Set the selected municipality to the input field
        setShowMunicipalityDropdown(false); // Close the dropdown
    };

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
                            {lng === "el" ? region.greekName : region.englishName}
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
                                    {lng === "el" ? county.greekName : county.englishName}
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
                        <label htmlFor="municipality_search" className="me-2">{t("regionOptions.municipality")}</label>
                        <input
                            id="municipality_search"
                            type="text"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            placeholder={t("regionOptions.selectMunicipality")}
                            className={`${styles.Text}"form-control"`}
                        />
                        {showMunicipalityDropdown && (
                            <ul className={`${styles.MuicipalityDropdown}`}>
                                {filteredMunicipalities.map((municipality) => (
                                    <li
                                        key={municipality.id}
                                        className={`${styles.MunicipalityDropdownLi} form-control`}
                                        onClick={() => handleMunicipalitySelect(municipality)}
                                    >
                                        {lng === "el" ? municipality.greekName : municipality.englishName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </Col>
        </Row>
    );
};

export default RegionCountyMunicipalitySelect;
