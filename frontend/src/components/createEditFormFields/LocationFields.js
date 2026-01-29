import React, { useEffect } from "react";
import { Form, Input, Row, Col, Tabs } from 'antd';
import { EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import RegionCountyMunicipalitySelect from "./RegionCountyMunicipalitySelect";
import useFetchLocationData from "../../hooks/useFetchLocationData";

const LocationFields = ({
    listingData,
    handleChange,
    errors,
    t,
    onRegionChange,
    onCountyChange,
    onMunicipalityChange,
    selectedRegion,
    selectedCounty,
    selectedMunicipality,
    edit,
}) => {
    const { regionsData } = useFetchLocationData();

    // Get municipality names
    const municipalityNameGr = regionsData
        .find((region) => region.id === selectedRegion)
        ?.counties.find((county) => county.id === selectedCounty)
        ?.municipalities.find((municipality) => municipality.id === selectedMunicipality)
        ?.greekName || "";

    const municipalityNameEn = regionsData
        .find((region) => region.id === selectedRegion)
        ?.counties.find((county) => county.id === selectedCounty)
        ?.municipalities.find((municipality) => municipality.id === selectedMunicipality)
        ?.englishName || "";

    // Auto-fill municipality_gr whenever municipality is selected
    useEffect(() => {
        if (municipalityNameGr && municipalityNameGr !== listingData.municipality_gr) {
            handleChange({
                target: {
                    name: "municipality_gr",
                    value: municipalityNameGr,
                },
            });
        }
    }, [municipalityNameGr, listingData.municipality_gr, handleChange]);

    const addressTabItems = [
        {
            key: 'en',
            label: (
                <span>
                    <GlobalOutlined />
                    English Address
                </span>
            ),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            label={t("propertyDetails.address_street")}
                            validateStatus={errors?.address_street ? "error" : ""}
                            help={errors?.address_street?.[0]}
                        >
                            <Input
                                name="address_street"
                                value={listingData.address_street}
                                onChange={handleChange}
                                placeholder={t("propertyDetails.address_street")}
                                prefix={<EnvironmentOutlined />}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Municipality (English)"
                            tooltip="Auto-filled from municipality selection above"
                        >
                            <Input
                                value={municipalityNameEn}
                                disabled
                                placeholder="Select municipality above"
                                size="large"
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#000',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
        {
            key: 'gr',
            label: (
                <span>
                    <GlobalOutlined />
                    Greek Address (Ελληνικά)
                </span>
            ),
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Form.Item
                            label={t("propertyDetails.address_street_gr")}
                            validateStatus={errors?.address_street_gr ? "error" : ""}
                            help={errors?.address_street_gr?.[0]}
                        >
                            <Input
                                name="address_street_gr"
                                value={listingData.address_street_gr}
                                onChange={handleChange}
                                placeholder={t("propertyDetails.address_street_gr")}
                                prefix={<EnvironmentOutlined />}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Municipality (Greek / Ελληνικά)"
                            tooltip="Συμπληρώνεται αυτόματα από την επιλογή δήμου"
                        >
                            <Input
                                name="municipality_gr"
                                value={listingData.municipality_gr || municipalityNameGr}
                                disabled
                                placeholder="Επιλέξτε δήμο παραπάνω"
                                size="large"
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#000',
                                    cursor: 'not-allowed'
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
    ];

    return (
        <div>
            {/* Region/County/Municipality Selection */}
            <RegionCountyMunicipalitySelect
                onRegionChange={onRegionChange}
                onCountyChange={onCountyChange}
                onMunicipalityChange={onMunicipalityChange}
                selectedRegion={selectedRegion}
                selectedCounty={selectedCounty}
                selectedMunicipality={selectedMunicipality}
                listingData={listingData}
                edit={edit}
            />

            {/* Address Fields with Tabs */}
            <div style={{ marginTop: '24px' }}>
                <Tabs
                    defaultActiveKey="en"
                    items={addressTabItems}
                    size="large"
                />
            </div>

            {/* Other Location Fields */}
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.address_number")}
                        validateStatus={errors?.address_number ? "error" : ""}
                        help={errors?.address_number?.[0]}
                    >
                        <Input
                            name="address_number"
                            value={listingData.address_number}
                            onChange={handleChange}
                            placeholder={t("propertyDetails.address_number")}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.postcode")}
                        validateStatus={errors?.postcode ? "error" : ""}
                        help={errors?.postcode?.[0]}
                    >
                        <Input
                            name="postcode"
                            value={listingData.postcode}
                            onChange={handleChange}
                            placeholder={t("propertyDetails.postcode")}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Coordinates */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.latitude")}
                        validateStatus={errors?.latitude ? "error" : ""}
                        help={errors?.latitude?.[0]}
                    >
                        <Input
                            type="number"
                            step="any"
                            name="latitude"
                            value={listingData.latitude}
                            onChange={handleChange}
                            placeholder="e.g., 37.9838"
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.longitude")}
                        validateStatus={errors?.longitude ? "error" : ""}
                        help={errors?.longitude?.[0]}
                    >
                        <Input
                            type="number"
                            step="any"
                            name="longitude"
                            value={listingData.longitude}
                            onChange={handleChange}
                            placeholder="e.g., 23.7275"
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};

export default LocationFields;