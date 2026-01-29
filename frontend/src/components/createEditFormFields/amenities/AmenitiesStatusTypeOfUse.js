import React from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Row, Col, Typography } from 'antd';

const { Title } = Typography;

export const AmenitiesTypeOfUse = ({
    amenities,
    create,
    selectedAmenities,
    handleAmenityChange
}) => {
    const { t } = useTranslation();

    const amenitiesTypeOfUse = amenities
        .filter(amenity => [
            'suitable_for_development',
            'suitable_for_office_use',
            'suitable_for_commercial_use',
            'suitable_for_residential_use',
            'suitable_for_short_stay',
            'suitable_for_warehouse_use',
            'suitable_for_industrial_use',
            'suitable_for_agricultural_use'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div>
            <Title level={5} style={{ marginBottom: 24 }}>
                {t('createEditForm.headers.type_of_use')}
            </Title>
            <Row gutter={[16, 16]}>
                {amenitiesTypeOfUse.map((amenity) => {
                    const amenityIdInt = typeof amenity.id === 'string' ? parseInt(amenity.id, 10) : amenity.id;
                    const isChecked = selectedAmenities?.includes(amenityIdInt) || false;

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
        </div>
    );
};

export const AmenitiesStatus = ({
    amenities,
    create,
    selectedAmenities,
    handleAmenityChange
}) => {
    const { t } = useTranslation();

    const amenitiesStatus = amenities
        .filter(amenity => [
            'auction',
            'under_offer',
            'rented',
            'sold',
            'under_construction'
        ].includes(amenity.name))
        .map(amenity => ({
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div>
            <Title level={5} style={{ marginBottom: 24 }}>
                {t('createEditForm.headers.status')}
            </Title>
            <Row gutter={[16, 16]}>
                {amenitiesStatus.map((amenity) => {
                    const amenityIdInt = typeof amenity.id === 'string' ? parseInt(amenity.id, 10) : amenity.id;
                    const isChecked = selectedAmenities?.includes(amenityIdInt) || false;

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
        </div>
    );
};
