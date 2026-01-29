import React from "react";
import { Form, Select, InputNumber, DatePicker, Row, Col } from 'antd';
import { DollarOutlined, CalendarOutlined, EuroOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const CurrencyPriceAvailability = ({
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

    const handleNumberChange = (name) => (value) => {
        handleChange({
            target: {
                name: name,
                value: value,
            },
        });
    };

    const handleDateChange = (date, dateString) => {
        handleChange({
            target: {
                name: "availability",
                value: dateString,
            },
        });
    };

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <Form.Item
                    label={t("propertyDetails.currency")}
                    validateStatus={errors?.currency ? "error" : ""}
                    help={errors?.currency?.[0]}
                    required
                >
                    <Select
                        value={listingData.currency || undefined}
                        onChange={handleSelectChange("currency")}
                        placeholder={t("propertyDetails.currency")}
                        size="large"
                    >
                        <Option value="€">€ EUR</Option>
                        <Option value="$">$ USD</Option>
                        <Option value="£">£ GBP</Option>
                    </Select>
                </Form.Item>
            </Col>

            <Col xs={24} md={8}>
                <Form.Item
                    label={`${t("propertyDetails.price")} ${listingData.currency && listingData.currency !== "---" ? listingData.currency : ""}`}
                    validateStatus={errors?.price ? "error" : ""}
                    help={errors?.price?.[0]}
                    required
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        value={listingData.price}
                        onChange={handleNumberChange("price")}
                        placeholder={t("propertyDetails.price")}
                        prefix={listingData.currency === "$" ? <DollarOutlined /> : listingData.currency === "€" ? <EuroOutlined /> : listingData.currency === "£" ? <DollarOutlined /> : null}
                        size="large"
                        min={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
            </Col>

            <Col xs={24} md={8}>
                <Form.Item
                    label={t("propertyDetails.availability")}
                    validateStatus={errors?.availability ? "error" : ""}
                    help={errors?.availability?.[0]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        value={listingData.availability ? dayjs(listingData.availability) : null}
                        onChange={handleDateChange}
                        placeholder={t("propertyDetails.availability")}
                        suffixIcon={<CalendarOutlined />}
                        size="large"
                        format="YYYY-MM-DD"
                    />
                </Form.Item>
            </Col>
        </Row>
    );
};

export default CurrencyPriceAvailability;
