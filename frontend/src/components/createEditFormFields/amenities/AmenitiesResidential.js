import React from 'react';
import useFetchAmenities from '../../../hooks/useFetchAmenities';
import { useTranslation } from 'react-i18next';
import { Card, Checkbox, Row, Col, Typography, Divider, Space } from 'antd';
import { HomeOutlined, BuildOutlined, ToolOutlined } from '@ant-design/icons';
import { AmenitiesStatus, AmenitiesTypeOfUse } from './AmenitiesStatusTypeOfUse';

const { Title } = Typography;

export const AmenitiesResidential = ({
    handleAmenityChange,
    selectedAmenities,
    create
}) => {
    const { amenities } = useFetchAmenities();
    const { t } = useTranslation();

    // Property Features
    const amenitiesResidentialProperty = amenities
        .filter(amenity => [
            'solar_water_heating', 'fireplace', 'air_conditioning', 'underfloor_heating',
            'furnished', 'part_funished', 'renovated', 'bright', 'painted', 'pets_allowed',
            'satellite', 'internal_stairs', 'double_glass', 'awnings', 'screens',
            'solar_heating', 'security_alarm', 'security_door', 'CCTV', 'night_electricity',
            'no_shared_expenses', 'insect_screen', 'ev_charger', 'loft', 'consierge'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Building Features
    const amenitiesResidentialBuilidingFeatures = amenities
        .filter(amenity => [
            'storage_room', 'corner', 'penthouse', 'bbq', 'swimming_pool', 'gym',
            'playroom', 'storage', 'basement', 'attic', 'veranda', 'terrace',
            'balcony', 'garden', 'parking'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Building Characteristics
    const amenitiesResidentialBuilidingCharacteristics = amenities
        .filter(amenity => [
            'luxurious', 'currently_rented', 'investment', 'student_apartment',
            'part_complete', 'need_renovation', 'landmark_building', 'elevator_in_building',
            'loft', 'facade', 'inside_zone_area'
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
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Property Features */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        <HomeOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        {t('createEditForm.headers.residential')}
                    </Title>
                }
                bordered={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesResidentialProperty)}
            </Card>

            {/* Building Features */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        <BuildOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        {t('createEditForm.headers.residentialBuildingFeatures')}
                    </Title>
                }
                bordered={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesResidentialBuilidingFeatures)}
            </Card>

            {/* Building Technical */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        <ToolOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                        {t('createEditForm.headers.residentialBuildingTechnical')}
                    </Title>
                }
                bordered={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesResidentialBuilidingCharacteristics)}
            </Card>

            <Divider />

            {/* Type of Use */}
            <Card
                bordered={false}
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
                bordered={false}
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
