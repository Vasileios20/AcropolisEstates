import React from 'react';
import useFetchAmenities from '../../../hooks/useFetchAmenities';
import { useTranslation } from 'react-i18next';
import { Card, Checkbox, Row, Col, Typography, Divider, Space } from 'antd';
import { AmenitiesStatus, AmenitiesTypeOfUse } from './AmenitiesStatusTypeOfUse';

const { Title } = Typography;

export const AmenitiesCommercial = ({
    handleAmenityChange,
    selectedAmenities,
    create
}) => {
    const { amenities } = useFetchAmenities();
    const { t } = useTranslation();

    // Property Features
    const amenitiesCommercialProperty = amenities
        .filter(amenity => [
            'solar_water_heating', 'fireplace', 'air_conditioning', 'underfloor_heating',
            'furnished', 'part_funished', 'renovated', 'bright', 'painted', 'pets_allowed',
            'satellite', 'internal_stairs', 'double_glass', 'awnings', 'screens',
            'solar_heating', 'security_alarm', 'security_door', 'CCTV', 'insect_screen',
            'night_electricity', 'no_shared_expenses'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Building Features
    const amenitiesCommercialBuilidingFeatures = amenities
        .filter(amenity => [
            'corner', 'penthouse', 'storage_room', 'parking', 'garden', 'storage',
            'basement', 'ev_charger', 'elevator_in_building', 'loft', 'attic',
            'veranda', 'terrace', 'balcony'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Building Characteristics
    const amenitiesCommercialBuilidingCharacteristics = amenities
        .filter(amenity => [
            'investment', 'luxurious', 'facade', 'currently_rented', 'landmark_building',
            'inside_zone_area', 'need_renovation', 'access_for_disabled', 'under_construction',
            'part_complete', '3_phase_electricity', 'loading_unloading_bay'
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
                        {t('createEditForm.headers.commercial')}
                    </Title>
                }
                bordered={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesCommercialProperty)}
            </Card>

            {/* Building Features */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        {t('createEditForm.headers.commercialBuildingFeatures')}
                    </Title>
                }
                bordered={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesCommercialBuilidingFeatures)}
            </Card>

            {/* Building Technical */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        {t('createEditForm.headers.commercialBuildingTechnical')}
                    </Title>
                }
                bordered={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesCommercialBuilidingCharacteristics)}
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
