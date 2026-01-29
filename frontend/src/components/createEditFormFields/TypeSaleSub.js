import React from "react";
import { Form, Select, Row, Col } from 'antd';
import { HomeOutlined, ShopOutlined, DollarOutlined } from '@ant-design/icons';

const { Option } = Select;

const TypeSaleSub = ({
    listingData,
    handleChange,
    errors,
    t,
}) => {
    const handleSelectChange = (name) => (value) => {
        handleChange({
            target: {
                name: name,
                value: value,
            },
        });
    };

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <Form.Item
                    label={t("propertyDetails.typeField")}
                    validateStatus={errors?.sale_type ? "error" : ""}
                    help={errors?.sale_type?.[0]}
                    required
                >
                    <Select
                        value={listingData.sale_type || undefined}
                        onChange={handleSelectChange("sale_type")}
                        placeholder={t("propertyDetails.typeField")}
                        suffixIcon={<DollarOutlined />}
                        size="large"
                    >
                        <Option value="rent">{t("propertyDetails.typeRent")}</Option>
                        <Option value="sale">{t("propertyDetails.typeSale")}</Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col xs={24} md={8}>
                <Form.Item
                    label={t("propertyDetails.types.title")}
                    validateStatus={errors?.type ? "error" : ""}
                    help={errors?.type?.[0]}
                    required
                >
                    <Select
                        value={listingData.type || undefined}
                        onChange={handleSelectChange("type")}
                        placeholder={t("propertyDetails.types.title")}
                        suffixIcon={<HomeOutlined />}
                        size="large"
                    >
                        <Option value="land">{t("propertyDetails.types.land")}</Option>
                        <Option value="commercial">{t("propertyDetails.types.commercial")}</Option>
                        <Option value="residential">{t("propertyDetails.types.residential")}</Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col xs={24} md={8}>
                <Form.Item
                    label={t("propertyDetails.subTypes.title")}
                    validateStatus={errors?.sub_type ? "error" : ""}
                    help={errors?.sub_type?.[0]}
                >
                    <Select
                        value={listingData.sub_type || undefined}
                        onChange={handleSelectChange("sub_type")}
                        placeholder={t("propertyDetails.subTypes.title")}
                        suffixIcon={<ShopOutlined />}
                        size="large"
                    >
                        <Option value="apartment">{t("propertyDetails.subTypes.apartment")}</Option>
                        <Option value="house">{t("propertyDetails.subTypes.house")}</Option>
                        <Option value="maisonette">{t("propertyDetails.subTypes.maisonette")}</Option>
                        <Option value="bungalow">{t("propertyDetails.subTypes.bungalow")}</Option>
                        <Option value="villa">{t("propertyDetails.subTypes.villa")}</Option>
                        <Option value="hotel">{t("propertyDetails.subTypes.hotel")}</Option>
                        <Option value="office">{t("propertyDetails.subTypes.office")}</Option>
                        <Option value="retail">{t("propertyDetails.subTypes.retail")}</Option>
                        <Option value="warehouse">{t("propertyDetails.subTypes.warehouse")}</Option>
                        <Option value="mixed_use">{t("propertyDetails.subTypes.mixed_use")}</Option>
                        <Option value="industrial">{t("propertyDetails.subTypes.industrial")}</Option>
                        <Option value="other">{t("propertyDetails.subTypes.other")}</Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
};

export default TypeSaleSub;
