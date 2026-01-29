import React from 'react';
import { Form, InputNumber, Select, Row, Col, Divider, Typography } from 'antd';
import {
    EnvironmentOutlined,
    CompassOutlined,
    EyeOutlined,
    FireOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const LandFields = ({
    listingData,
    handleChange,
    errors,
    t,
}) => {
    const handleNumberChange = (name) => (value) => {
        handleChange({
            target: {
                name: name,
                value: value || "0",
            },
        });
    };

    const handleSelectChange = (name) => (value) => {
        handleChange({
            target: {
                name: name,
                value: value,
            },
        });
    };

    return (
        <div>
            {/* Land Measurements */}
            <Title level={5}>
                <EnvironmentOutlined /> {t("createEditForm.headers.landMeasurements")}
            </Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={`${t("propertyDetails.landArea")} (m²)`}
                        validateStatus={errors?.land_area ? "error" : ""}
                        help={errors?.land_area?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.land_area || 0}
                            onChange={handleNumberChange("land_area")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={`${t("propertyDetails.lengthOfFacade")} (m)`}
                        validateStatus={errors?.length_of_facade ? "error" : ""}
                        help={errors?.length_of_facade?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.length_of_facade || 0}
                            onChange={handleNumberChange("length_of_facade")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            {/* Building Coefficients */}
            <Title level={5}>
                Building Coefficients
            </Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={`${t("propertyDetails.cover_coefficient")} (%)`}
                        validateStatus={errors?.cover_coefficient ? "error" : ""}
                        help={errors?.cover_coefficient?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.cover_coefficient || 0}
                            onChange={handleNumberChange("cover_coefficient")}
                            min={0}
                            max={100}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={`${t("propertyDetails.building_coefficient")} (%)`}
                        validateStatus={errors?.building_coefficient ? "error" : ""}
                        help={errors?.building_coefficient?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.building_coefficient || 0}
                            onChange={handleNumberChange("building_coefficient")}
                            min={0}
                            max={100}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            {/* Land Characteristics */}
            <Title level={5}>
                <CompassOutlined /> {t("createEditForm.headers.landCharacteristics")}
            </Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.orientationTypes.title")}
                        validateStatus={errors?.orientation ? "error" : ""}
                        help={errors?.orientation?.[0]}
                    >
                        <Select
                            value={listingData.orientation || undefined}
                            onChange={handleSelectChange("orientation")}
                            placeholder={t("propertyDetails.orientationTypes.title")}
                            suffixIcon={<CompassOutlined />}
                            size="large"
                        >
                            <Option value="north">{t("propertyDetails.orientationTypes.north")}</Option>
                            <Option value="north_east">{t("propertyDetails.orientationTypes.north_east")}</Option>
                            <Option value="east">{t("propertyDetails.orientationTypes.east")}</Option>
                            <Option value="south_east">{t("propertyDetails.orientationTypes.south_east")}</Option>
                            <Option value="south">{t("propertyDetails.orientationTypes.south")}</Option>
                            <Option value="south_west">{t("propertyDetails.orientationTypes.south_west")}</Option>
                            <Option value="west">{t("propertyDetails.orientationTypes.west")}</Option>
                            <Option value="north_west">{t("propertyDetails.orientationTypes.north_west")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.viewTypes.title")}
                        validateStatus={errors?.view ? "error" : ""}
                        help={errors?.view?.[0]}
                    >
                        <Select
                            value={listingData.view || undefined}
                            onChange={handleSelectChange("view")}
                            placeholder={t("propertyDetails.viewTypes.title")}
                            suffixIcon={<EyeOutlined />}
                            size="large"
                        >
                            <Option value="sea">{t("propertyDetails.viewTypes.sea")}</Option>
                            <Option value="mountain">{t("propertyDetails.viewTypes.mountain")}</Option>
                            <Option value="city">{t("propertyDetails.viewTypes.city")}</Option>
                            <Option value="other">{t("propertyDetails.viewTypes.other")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.slopeTypes.title")}
                        validateStatus={errors?.slope ? "error" : ""}
                        help={errors?.slope?.[0]}
                    >
                        <Select
                            value={listingData.slope || undefined}
                            onChange={handleSelectChange("slope")}
                            placeholder={t("propertyDetails.slopeTypes.title")}
                            size="large"
                        >
                            <Option value="level">{t("propertyDetails.slopeTypes.level")}</Option>
                            <Option value="view">{t("propertyDetails.slopeTypes.view")}</Option>
                            <Option value="incline">{t("propertyDetails.slopeTypes.incline")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.zoneTypes.title")}
                        validateStatus={errors?.zone ? "error" : ""}
                        help={errors?.zone?.[0]}
                    >
                        <Select
                            value={listingData.zone || undefined}
                            onChange={handleSelectChange("zone")}
                            placeholder={t("propertyDetails.zoneTypes.title")}
                            size="large"
                        >
                            <Option value="residential">{t("propertyDetails.zoneTypes.residential")}</Option>
                            <Option value="commercial">{t("propertyDetails.zoneTypes.commercial")}</Option>
                            <Option value="industrial">{t("propertyDetails.zoneTypes.industrial")}</Option>
                            <Option value="agricultural">{t("propertyDetails.zoneTypes.agricultural")}</Option>
                            <Option value="tourist">{t("propertyDetails.zoneTypes.tourist")}</Option>
                            <Option value="mixed">{t("propertyDetails.zoneTypes.mixed")}</Option>
                            <Option value="redevelopment">{t("propertyDetails.zoneTypes.redevelopment")}</Option>
                            <Option value="other">{t("propertyDetails.zoneTypes.other")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label={`${t("propertyDetails.distanceFromSea")} (m)`}
                        validateStatus={errors?.distance_from_sea ? "error" : ""}
                        help={errors?.distance_from_sea?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.distance_from_sea || 0}
                            onChange={handleNumberChange("distance_from_sea")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            {/* Utilities */}
            <Title level={5}>
                <ThunderboltOutlined /> {t("createEditForm.headers.utilities")}
            </Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.powerType.title")}
                        validateStatus={errors?.power_type ? "error" : ""}
                        help={errors?.power_type?.[0]}
                    >
                        <Select
                            value={listingData.power_type || undefined}
                            onChange={handleSelectChange("power_type")}
                            placeholder={t("propertyDetails.powerType.title")}
                            suffixIcon={<ThunderboltOutlined />}
                            size="large"
                        >
                            <Option value="electricity">{t("propertyDetails.powerType.electricity")}</Option>
                            <Option value="gas">{t("propertyDetails.powerType.gas")}</Option>
                            <Option value="natural_gas">{t("propertyDetails.powerType.natural_gas")}</Option>
                            <Option value="heat_pump">{t("propertyDetails.powerType.heat_pump")}</Option>
                            <Option value="other">{t("propertyDetails.heating_system.other")}</Option>
                            <Option value="n/a">{t("propertyDetails.heating_system.n/a")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.heating_system.title")}
                        validateStatus={errors?.heating_system ? "error" : ""}
                        help={errors?.heating_system?.[0]}
                    >
                        <Select
                            value={listingData.heating_system || undefined}
                            onChange={handleSelectChange("heating_system")}
                            placeholder={t("propertyDetails.heating_system.title")}
                            suffixIcon={<FireOutlined />}
                            size="large"
                        >
                            <Option value="autonomous">{t("propertyDetails.heating_system.autonomous")}</Option>
                            <Option value="central">{t("propertyDetails.heating_system.central")}</Option>
                            <Option value="air_condition">{t("propertyDetails.heating_system.air_condition")}</Option>
                            <Option value="fireplace">{t("propertyDetails.heating_system.fireplace")}</Option>
                            <Option value="solar">{t("propertyDetails.heating_system.solar")}</Option>
                            <Option value="geothermal">{t("propertyDetails.heating_system.geothermal")}</Option>
                            <Option value="other">{t("propertyDetails.heating_system.other")}</Option>
                            <Option value="n/a">{t("propertyDetails.heating_system.n/a")}</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};

export default LandFields;
