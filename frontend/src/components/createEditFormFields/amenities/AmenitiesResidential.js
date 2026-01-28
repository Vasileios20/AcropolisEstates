import React from 'react'
import useFetchAmenities from '../../../hooks/useFetchAmenities'
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AmenitiesStatus, AmenitiesTypeOfUse } from './AmenitiesStatusTypeOfUse';


export const AmenitiesResidential = (
    {
        handleAmenityChange,
        selectedAmenities,
        create
    }) => {
    const { amenities } = useFetchAmenities()
    const { t } = useTranslation();

    const amenitiesResidentialProperty = amenities.map(amenity => {
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
            amenity.name === 'night_electricity' ||
            amenity.name === 'no_shared_expenses' ||
            amenity.name === 'insect_screen' ||
            amenity.name === 'ev_charger' ||
            amenity.name === 'loft' ||
            amenity.name === 'consierge'
        ) {
            return amenity;
        }
        return null;
    }).filter(amenity => amenity !== null);

    const amenitiesResidentialPropertyTranslated = amenitiesResidentialProperty.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesResidentialPropertyTranslatedSorted = amenitiesResidentialPropertyTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const amenitiesResidentialBuilidingFeatures = amenities.map(amenity => {
        if (amenity.name === 'storage_room' ||
            amenity.name === 'corner' ||
            amenity.name === 'penthouse' ||
            amenity.name === 'bbq' ||
            amenity.name === 'swimming_pool' ||
            amenity.name === 'gym' ||
            amenity.name === 'playroom' ||
            amenity.name === 'storage' ||
            amenity.name === 'basement' ||
            amenity.name === 'attic' ||
            amenity.name === 'veranda' ||
            amenity.name === 'terrace' ||
            amenity.name === 'balcony' ||
            amenity.name === 'garden' ||
            amenity.name === 'parking'
        ) {
            return amenity;
        }
        return null;
    }
    ).filter(amenity => amenity !== null);

    const amenitiesResidentialBuilidingFeaturesTranslated = amenitiesResidentialBuilidingFeatures.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesResidentialBuilidingFeaturesTranslatedSorted = amenitiesResidentialBuilidingFeaturesTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const amenitiesResidentialBuilidingCharacteristics = amenities.map(amenity => {
        if (amenity.name === 'luxurious' ||
            amenity.name === 'currently_rented' ||
            amenity.name === 'investment' ||
            amenity.name === 'student_apartment' ||
            amenity.name === 'part_complete' ||
            amenity.name === 'need_renovation' ||
            amenity.name === 'landmark_building' ||
            amenity.name === 'elevator_in_building' ||
            amenity.name === 'loft' ||
            amenity.name === 'facade' ||
            amenity.name === 'inside_zone_area'
        ) {
            return amenity;
        }
        return null;
    }
    ).filter(amenity => amenity !== null);

    const amenitiesResidentialBuilidingCharacteristicsTranslated = amenitiesResidentialBuilidingCharacteristics.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesResidentialBuilidingCharacteristicsTranslatedSorted = amenitiesResidentialBuilidingCharacteristicsTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const renderLabels = (amenities) => {
        const columns = [[], [], [], []];
        amenities.forEach((amenity, index) => {
            columns[index % 4].push(amenity);
        });
        return columns.map((column, colIndex) => (
            <Col key={colIndex} className="mx-auto p-2 text-start">
                {column.slice(0, 10).map((amenity) => (
                    <div key={amenity.id} className="ms-5 p-2">
                        <label className="p-2 border shadow">
                            <input
                                className="m-1"
                                type="checkbox"
                                checked={selectedAmenities?.includes(amenity.id)}
                                onChange={() => handleAmenityChange(amenity.id)}
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
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.residential')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesResidentialPropertyTranslatedSorted)}
                </Row>
                <hr />
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.residentialBuildingFeatures')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesResidentialBuilidingFeaturesTranslatedSorted)}
                </Row>
                <hr />
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.residentialBuildingTechnical')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesResidentialBuilidingCharacteristicsTranslatedSorted)}
                </Row>
                <hr />
                <AmenitiesTypeOfUse
                    amenities={amenities}
                    create={create}
                    selectedAmenities={selectedAmenities}
                    handleAmenityChange={handleAmenityChange}
                />
                <hr />
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