import React from 'react'
import useFetchAmenities from '../../../hooks/useFetchAmenities'
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AmenitiesStatus, AmenitiesTypeOfUse } from './AmenitiesStatusTypeOfUse';


export const AmenitiesCommercial = (
    {
        handleAmenityChange,
        selectedAmenities,
        create
    }) => {
    const { amenities } = useFetchAmenities()
    const { t } = useTranslation();

    const amenitiesCommercialProperty = amenities.map(amenity => {
        if (amenity.name === 'solar_water_heating' ||
            amenity.name === 'fireplace' ||
            amenity.name === 'air_conditioning' ||
            amenity.name === 'underfloor_heating' ||
            amenity.name === 'furnished' ||
            amenity.name === 'part_funished' ||
            amenity.name === 'renovated' ||
            amenity.name === 'bright' ||
            amenity.name === 'painted' ||
            amenity.name === 'pets_allowed' ||
            amenity.name === 'satellite' ||
            amenity.name === 'internal_stairs' ||
            amenity.name === 'double_glass' ||
            amenity.name === 'awnings' ||
            amenity.name === 'screens' ||
            amenity.name === 'solar_heating' ||
            amenity.name === 'security_alarm' ||
            amenity.name === 'security_door' ||
            amenity.name === 'CCTV' ||
            amenity.name === 'insect_screen' ||
            amenity.name === 'night_electricity' ||
            amenity.name === 'no_shared_expenses'
        ) {
            return amenity;
        }
        return null;
    }).filter(amenity => amenity !== null);

    const amenitiesCommercialPropertyTranslated = amenitiesCommercialProperty.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesCommercialPropertyTranslatedSorted = amenitiesCommercialPropertyTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const amenitiesCommercialBuilidingFeatures = amenities.map(amenity => {
        if (amenity.name === 'corner' ||
            amenity.name === 'penthouse' ||
            amenity.name === 'storage_room' ||
            amenity.name === 'parking' ||
            amenity.name === 'garden' ||
            amenity.name === 'storage' ||
            amenity.name === 'basement' ||
            amenity.name === 'ev_charger' ||
            amenity.name === 'elevator_in_building' ||
            amenity.name === 'loft' ||
            amenity.name === 'attic' ||
            amenity.name === 'veranda' ||
            amenity.name === 'terrace' ||
            amenity.name === 'balcony'
        ) {
            return amenity;
        }
        return null;
    }
    ).filter(amenity => amenity !== null);

    const amenitiesCommercialBuilidingFeaturesTranslated = amenitiesCommercialBuilidingFeatures.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesCommercialBuilidingFeaturesTranslatedSorted = amenitiesCommercialBuilidingFeaturesTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const amenitiesCommercialBuilidingCharacteristics = amenities.map(amenity => {
        if (amenity.name === 'investment' ||
            amenity.name === 'luxurious' ||
            amenity.name === 'facade' ||
            amenity.name === 'currently_rented' ||
            amenity.name === 'landmark_building' ||
            amenity.name === 'inside_zone_area' ||
            amenity.name === 'need_renovation' ||
            amenity.name === 'access_for_disabled' ||
            amenity.name === 'under_construction' ||
            amenity.name === 'part_complete'
        ) {
            return amenity;
        }
        return null;
    }
    ).filter(amenity => amenity !== null);

    const amenitiesCommercialBuilidingCharacteristicsTranslated = amenitiesCommercialBuilidingCharacteristics.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesCommercialBuilidingCharacteristicsTranslatedSorted = amenitiesCommercialBuilidingCharacteristicsTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const renderLabels = (amenities) => {
        const columns = [[], [], [], []]; // Assuming 4 columns
        amenities.forEach((amenity, index) => {
            columns[index % 4].push(amenity);
        });
        return columns.map((column, colIndex) => (
            <Col key={colIndex} className="mx-auto p-2 text-start">
                {column.slice(0, 10).map((amenity) => (
                    <div key={amenity.id} className="ms-5 p-2">
                        <label className="p-2 border">
                            <input
                                className="m-1"
                                type="checkbox"
                                value={amenity.id}
                                checked={create ? null : selectedAmenities.includes(amenity.id)}
                                onChange={handleAmenityChange}
                            />
                            {amenity.name.replace(/_/g, " ")}
                        </label>
                    </div>
                ))}
            </Col>
        ));
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.commercial')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesCommercialPropertyTranslatedSorted)}
                </Row>
                <hr />
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.commercialBuildingFeatures')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesCommercialBuilidingFeaturesTranslatedSorted)}
                </Row>
                <hr />
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.commercialBuildingTechnical')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesCommercialBuilidingCharacteristicsTranslatedSorted)}
                </Row>
                <hr />
                <AmenitiesTypeOfUse
                    amenities={amenities}
                    create={create}
                    selectedAmenities={selectedAmenities}
                    handleAmenityChange={handleAmenityChange}
                /> <hr />
                <AmenitiesStatus
                    amenities={amenities}
                    create={create}
                    selectedAmenities={selectedAmenities}
                    handleAmenityChange={handleAmenityChange}
                />
            </Container>
        </>
    )
}
