import React from 'react';
import useFetchAmenities from '../../../hooks/useFetchAmenities';
import { useTranslation } from 'react-i18next';
import { Card, Checkbox, Row, Col, Typography, Divider, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { AmenitiesTypeOfUse, AmenitiesStatus } from './AmenitiesStatusTypeOfUse';

const { Title } = Typography;

export const AmenitiesLand = ({
    handleAmenityChange,
    selectedAmenities,
    create
}) => {
    const { amenities } = useFetchAmenities();
    const { t } = useTranslation();

    // Land Amenities
    const amenitiesLand = amenities
        .filter(amenity => [
            'property_consideration',
            'inside_the_settlement',
            'facade'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const renderAmenityCheckboxes = (amenitiesList) => {
        return (
            <Row gutter={[16, 16]}>
                {amenitiesList.map((amenity) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={amenity.id}>
                        <Checkbox
                            checked={selectedAmenities?.includes(amenity.id)}
                            onChange={() => handleAmenityChange(amenity.id)}
                        >
                            <span style={{ fontSize: '14px' }}>
                                {amenity.name.replace(/_/g, " ")}
                            </span>
                        </Checkbox>
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            {/* Land Features */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        <EnvironmentOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        {t('createEditForm.headers.land')}
                    </Title>
                }
                variant={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesLand)}
            </Card>

            <Divider />

            {/* Type of Use */}
            <Card
                variant={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                <AmenitiesTypeOfUse
                    amenities={amenities}
                    create={create}
                    selectedAmenities={selectedAmenities}
                    handleAmenityChange={handleAmenityChange}
                />
            </Card>

            {/* Status */}
            <Card
                variant={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                <AmenitiesStatus
                    amenities={amenities}
                    create={create}
                    selectedAmenities={selectedAmenities}
                    handleAmenityChange={handleAmenityChange}
                />
            </Card>
        </Space>
    );
};
