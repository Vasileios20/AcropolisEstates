import React from 'react';
import { Form, InputNumber, Select, Row, Col, Divider, Typography } from 'antd';
import {
    HomeOutlined,
    BulbOutlined,
    FireOutlined,
    ThunderboltOutlined,
    BuildOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const ResidentialFields = ({
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

    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 1899 },
        (_, i) => i + 1900
    );

    return (
        <div>
            {/* Area Section */}
            <Title level={5}>
                <HomeOutlined /> {t("createEditForm.headers.area")}
            </Title>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label={`${t("propertyDetails.floorArea")} (m²)`}
                        validateStatus={errors?.floor_area ? "error" : ""}
                        help={errors?.floor_area?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.floor_area || 0}
                            onChange={handleNumberChange("floor_area")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
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
                <Col xs={24} md={8}>
                    <Form.Item
                        label={t("propertyDetails.levels")}
                        validateStatus={errors?.levels ? "error" : ""}
                        help={errors?.levels?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.levels || 0}
                            onChange={handleNumberChange("levels")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            {/* Rooms Section */}
            <Title level={5}>
                <BuildOutlined /> {t("createEditForm.headers.rooms")}
            </Title>
            <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                    <Form.Item
                        label={t("propertyDetails.bedrooms")}
                        validateStatus={errors?.bedrooms ? "error" : ""}
                        help={errors?.bedrooms?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.bedrooms || 0}
                            onChange={handleNumberChange("bedrooms")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item
                        label={t("propertyDetails.bathrooms")}
                        validateStatus={errors?.bathrooms ? "error" : ""}
                        help={errors?.bathrooms?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.bathrooms || 0}
                            onChange={handleNumberChange("bathrooms")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item
                        label={t("propertyDetails.wc")}
                        validateStatus={errors?.wc ? "error" : ""}
                        help={errors?.wc?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.wc || 0}
                            onChange={handleNumberChange("wc")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item
                        label={t("propertyDetails.floor")}
                        validateStatus={errors?.floor ? "error" : ""}
                        help={errors?.floor?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.floor || 0}
                            onChange={handleNumberChange("floor")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item
                        label={t("propertyDetails.kitchens")}
                        validateStatus={errors?.kitchens ? "error" : ""}
                        help={errors?.kitchens?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.kitchens || 0}
                            onChange={handleNumberChange("kitchens")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} md={6}>
                    <Form.Item
                        label={t("propertyDetails.living_rooms")}
                        validateStatus={errors?.living_rooms ? "error" : ""}
                        help={errors?.living_rooms?.[0]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            value={listingData.living_rooms || 0}
                            onChange={handleNumberChange("living_rooms")}
                            min={0}
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Divider />

            {/* Technical Details Section */}
            <Title level={5}>
                <FireOutlined /> {t("createEditForm.headers.technicalDetails")}
            </Title>
            <Row gutter={[16, 16]}>
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

                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.energyClass")}
                        validateStatus={errors?.energy_class ? "error" : ""}
                        help={errors?.energy_class?.[0]}
                    >
                        <Select
                            value={listingData.energy_class || undefined}
                            onChange={handleSelectChange("energy_class")}
                            placeholder={t("propertyDetails.energyClass")}
                            suffixIcon={<BulbOutlined />}
                            size="large"
                        >
                            {Array.from("ABCDEFG").map((letter) => (
                                <Option key={letter} value={letter}>{letter}</Option>
                            ))}
                            <Option value="to_be_issued">{t("propertyDetails.energyClassTypes.toBeIssued")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

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
                        label={t("propertyDetails.floorTypes.title")}
                        validateStatus={errors?.floor_type ? "error" : ""}
                        help={errors?.floor_type?.[0]}
                    >
                        <Select
                            value={listingData.floor_type || undefined}
                            onChange={handleSelectChange("floor_type")}
                            placeholder={t("propertyDetails.floorTypes.title")}
                            size="large"
                        >
                            <Option value="marble">{t("propertyDetails.floorTypes.marble")}</Option>
                            <Option value="tile">{t("propertyDetails.floorTypes.tile")}</Option>
                            <Option value="wooden">{t("propertyDetails.floorTypes.wooden")}</Option>
                            <Option value="granite">{t("propertyDetails.floorTypes.granite")}</Option>
                            <Option value="mosaic">{t("propertyDetails.floorTypes.mosaic")}</Option>
                            <Option value="stone">{t("propertyDetails.floorTypes.stone")}</Option>
                            <Option value="laminate">{t("propertyDetails.floorTypes.laminate")}</Option>
                            <Option value="parquet">{t("propertyDetails.floorTypes.parquet")}</Option>
                            <Option value="carpet">{t("propertyDetails.floorTypes.carpet")}</Option>
                            <Option value="cement">{t("propertyDetails.floorTypes.cement")}</Option>
                            <Option value="other">{t("propertyDetails.floorTypes.other")}</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label={t("propertyDetails.yearBuilt")}
                        validateStatus={errors?.construction_year ? "error" : ""}
                        help={errors?.construction_year?.[0]}
                    >
                        <Select
                            value={listingData.construction_year || undefined}
                            onChange={handleSelectChange("construction_year")}
                            placeholder={t("propertyDetails.yearBuilt")}
                            showSearch
                            size="large"
                        >
                            {years.reverse().map((year) => (
                                <Option key={year} value={year}>{year}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );
};

export default ResidentialFields;
