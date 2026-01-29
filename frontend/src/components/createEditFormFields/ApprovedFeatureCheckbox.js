import React from "react";
import { Form, Checkbox, Row, Col } from 'antd';

export const ApprovedFeatureCheckbox = ({
    listingData,
    handleChecked,
    errors,
    t,
}) => {
    return (
        <Row gutter={[16, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} md={12}>
                <Form.Item
                    validateStatus={errors?.approved ? "error" : ""}
                    help={errors?.approved?.[0]}
                >
                    <Checkbox
                        name="approved"
                        checked={listingData.approved}
                        onChange={handleChecked}
                    >
                        {t("propertyDetails.approved")}
                    </Checkbox>
                </Form.Item>
            </Col>

            <Col xs={24} md={12}>
                <Form.Item
                    validateStatus={errors?.featured ? "error" : ""}
                    help={errors?.featured?.[0]}
                >
                    <Checkbox
                        name="featured"
                        checked={listingData.featured}
                        onChange={handleChecked}
                    >
                        {t("propertyDetails.featured")}
                    </Checkbox>
                </Form.Item>
            </Col>
        </Row>
    );
};
