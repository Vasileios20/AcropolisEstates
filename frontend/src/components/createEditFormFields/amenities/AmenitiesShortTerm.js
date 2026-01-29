import React from 'react';
import useFetchAmenities from '../../../hooks/useFetchAmenities';
import { useTranslation } from 'react-i18next';
import { Card, Checkbox, Row, Col, Typography, Space } from 'antd';

const { Title } = Typography;

const AmenitiesShortTerm = ({
    handleAmenityChange,
    selectedAmenities,
    create
}) => {
    const { amenities } = useFetchAmenities();
    const { t } = useTranslation();

    // Property Amenities
    const amenitiesProperty = amenities
        .filter(amenity => [
            'air_conditioning', 'aluminum_shutters', 'balcony', 'bbq', 'bathroom',
            'coffee_machine', 'dining_room', 'dishwasher', 'en_suite_toilet', 'equipment',
            'fireplace', 'fire_detector', 'fire_extinguisher', 'fridge_freezer', 'guest_toilet',
            'guestroom', 'hair_dryer', 'hot_water_system', 'iron_iron_board', 'jacuzzi',
            'kitchenette', 'microwave', 'hob_oven', 'patio', 'private_terrace',
            'raised_floor', 'sauna', 'sea_view', 'security_door', 'shower',
            'sitting_room', 'sofa_bed', 'private_swimming_pool', 'vacuum_cleaner',
            'villa', 'washing_machine', 'water_pressure_system', 'window_blinds'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Building Features
    const amenitiesBuildingFeatures = amenities
        .filter(amenity => [
            'parking', 'elevator_in_building', 'garden', 'swimming_pool'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Area Places
    const amenitiesAreaPlaces = amenities
        .filter(amenity => [
            'church', 'cinema', 'super_market'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Apartment Rules
    const amenitiesApartmentRules = amenities
        .filter(amenity => [
            'pets_allowed', 'no_pets_allowed', 'smoking_allowed', 'no_smoking_allowed',
            'parties_allowed', 'no_parties_allowed', 'children_allowed', 'no_children_allowed',
            'long_term_stay_allowed', 'suitable_for_events', 'suitable_for_disabled',
            'check_in_after_3', 'check_out_before_11'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const renderAmenityCheckboxes = (amenitiesList) => {
        return (
            <Row gutter={[16, 16]}>
                {amenitiesList.map((amenity) => {
                    const amenityIdInt = typeof amenity.id === 'string' ? parseInt(amenity.id, 10) : amenity.id;
                    const isChecked = selectedAmenities?.includes(amenityIdInt);

                    return (
                        <Col xs={24} sm={12} md={8} lg={6} key={amenity.id}>
                            <Checkbox
                                checked={isChecked}
                                onChange={() => handleAmenityChange(amenityIdInt)}
                            >
                                <span style={{ fontSize: '14px' }}>
                                    {amenity.name.replace(/_/g, " ")}
                                </span>
                            </Checkbox>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            {/* Property Amenities */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        {t('createEditForm.headers.shortTermPropertyAmenities')}
                    </Title>
                }
                variant={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesProperty)}
            </Card>

            {/* Building Amenities */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        {t('createEditForm.headers.shortTermBuildingAmenities')}
                    </Title>
                }
                variant={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesBuildingFeatures)}
            </Card>

            {/* Area Places */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        {t('createEditForm.headers.shortTermAreaPlacesAmenities')}
                    </Title>
                }
                variant={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesAreaPlaces)}
            </Card>

            {/* Apartment Rules */}
            <Card
                title={
                    <Title level={5} style={{ margin: 0 }}>
                        {t('createEditForm.headers.shortTermApartmentRules')}
                    </Title>
                }
                variant={false}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
                {renderAmenityCheckboxes(amenitiesApartmentRules)}
            </Card>
        </Space>
    );
};

export default AmenitiesShortTerm;
