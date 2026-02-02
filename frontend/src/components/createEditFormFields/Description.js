import React from "react";
import { Form, Input, Tabs } from 'antd';
import { GlobalOutlined, FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Description = ({
    listingData,
    handleChange,
    errors,
    t,
}) => {
    const tabItems = [
        {
            key: 'en',
            label: (
                <span>
                    <GlobalOutlined />
                    {t("propertyDetails.description")}
                </span>
            ),
            children: (
                <Form.Item
                    validateStatus={errors?.description ? "error" : ""}
                    help={errors?.description?.[0]}
                    required
                >
                    <TextArea
                        rows={6}
                        name="description"
                        value={listingData.description}
                        onChange={handleChange}
                        placeholder={t("propertyDetails.description")}
                        required
                    />
                </Form.Item>
            ),
        },
        {
            key: 'gr',
            label: (
                <span>
                    <FileTextOutlined />
                    {t("propertyDetails.description_gr")}
                </span>
            ),
            children: (
                <Form.Item
                    validateStatus={errors?.description_gr ? "error" : ""}
                    help={errors?.description_gr?.[0]}
                    required
                >
                    <TextArea
                        rows={6}
                        name="description_gr"
                        value={listingData.description_gr}
                        onChange={handleChange}
                        placeholder={t("propertyDetails.description_gr")}
                    />
                </Form.Item>
            ),
        },
    ];

    return (
        <div style={{ marginTop: '16px' }}>
            <Tabs
                defaultActiveKey="en"
                items={tabItems}
                size="large"
            />
        </div>
    );
};

export default Description;
