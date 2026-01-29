import React, { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Select, AutoComplete, Form } from "antd";

import useFetchLocationData from "../../hooks/useFetchLocationData";

const { Option } = Select;

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

    const [municipalitySearch, setMunicipalitySearch] = useState("");

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
    }, [
        listingData.region_id,
        listingData.county_id,
        listingData.municipality_id,
        onRegionChange,
        onCountyChange,
        onMunicipalityChange,
        selectedRegion,
        selectedCounty,
        selectedMunicipality
    ]);

    const selectedRegionObj = useMemo(
        () => regionsData.find(region => region.id === selectedRegion),
        [regionsData, selectedRegion]
    );

    const counties = useMemo(
        () => selectedRegionObj?.counties || [],
        [selectedRegionObj]
    );

    const selectedCountyObj = useMemo(
        () => counties.find(county => county.id === selectedCounty),
        [counties, selectedCounty]
    );

    const municipalities = useMemo(
        () => selectedCountyObj?.municipalities || [],
        [selectedCountyObj]
    );

    // Convert municipalities to AutoComplete options
    const municipalityOptions = useMemo(() => {
        return municipalities.map(municipality => ({
            value: lng === "el" ? municipality.greekName : municipality.englishName,
            label: lng === "el" ? municipality.greekName : municipality.englishName,
            id: municipality.id,
            greekName: municipality.greekName,
        }));
    }, [municipalities, lng]);

    // Filter municipalities based on search
    const filteredOptions = useMemo(() => {
        if (!municipalitySearch) return municipalityOptions;
        return municipalityOptions.filter(option =>
            option.label.toLowerCase().includes(municipalitySearch.toLowerCase())
        );
    }, [municipalityOptions, municipalitySearch]);

    const handleRegionChange = (value) => {
        onRegionChange(value);
        setMunicipalitySearch("");
    };

    const handleCountyChange = (value) => {
        onCountyChange(value);
        setMunicipalitySearch("");
    };

    const handleMunicipalitySelect = (value, option) => {
        if (option && option.id) {
            onMunicipalityChange(option.id, option.greekName);
            setMunicipalitySearch(value);
        }
    };

    const handleMunicipalitySearch = (value) => {
        setMunicipalitySearch(value);
    };

    return (
        <Row gutter={[16, 16]}>
            {/* Region Select */}
            <Col xs={24} md={8}>
                <Form.Item
                    label={
                        <span>
                            {t("regionOptions.region")}
                        </span>
                    }
                    required
                >
                    <Select
                        value={selectedRegion || undefined}
                        onChange={handleRegionChange}
                        placeholder={t("regionOptions.selectRegion")}
                        size="large"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {regionsData.map(region => (
                            <Option key={region.id} value={region.id}>
                                {lng === "el" ? region.greekName : region.englishName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>

            {/* County Select */}
            <Col xs={24} md={8}>
                {selectedRegion && (
                    <Form.Item
                        label={
                            <span>
                                {selectedRegion === 1 ? t("regionOptions.sectors") : t("regionOptions.county")}
                            </span>
                        }
                        required
                    >
                        <Select
                            value={selectedCounty || undefined}
                            onChange={handleCountyChange}
                            placeholder={t("regionOptions.selectCounty")}
                            size="large"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {counties.map(county => (
                                <Option key={county.id} value={county.id}>
                                    {lng === "el" ? county.greekName : county.englishName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Col>

            {/* Municipality AutoComplete */}
            <Col xs={24} md={8}>
                {selectedCounty && (
                    <Form.Item
                        label={
                            <span>

                                {t("regionOptions.municipality")}
                            </span>
                        }
                        required
                    >
                        <AutoComplete
                            value={municipalitySearch}
                            options={filteredOptions}
                            onSelect={handleMunicipalitySelect}
                            onSearch={handleMunicipalitySearch}
                            placeholder={t("regionOptions.selectMunicipality")}
                            size="large"
                            filterOption={false}
                        />
                    </Form.Item>
                )}
            </Col>
        </Row>
    );
};

export default RegionCountyMunicipalitySelect;
