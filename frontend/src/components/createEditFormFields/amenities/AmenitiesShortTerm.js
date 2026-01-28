import React from 'react'
import useFetchAmenities from '../../../hooks/useFetchAmenities'
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AmenitiesShortTerm = (
    {
        handleAmenityChange,
        selectedAmenities,
        create
    }) => {
    const { amenities } = useFetchAmenities()
    const { t } = useTranslation();


    const amenitiesProperty = amenities.map(amenity => {
        if (amenity.name === 'air_conditioning' ||
            amenity.name === 'aluminum_shutters' ||
            amenity.name === 'balcony' ||
            amenity.name === 'bbq' ||
            amenity.name === 'bathroom' ||
            amenity.name === 'coffee_machine' ||
            amenity.name === 'dining_room' ||
            amenity.name === 'dishwasher' ||
            amenity.name === 'en_suite_toilet' ||
            amenity.name === 'equipment' ||
            amenity.name === 'fireplace' ||
            amenity.name === 'fire_detector' ||
            amenity.name === 'fire_extinguisher' ||
            amenity.name === 'fridge_freezer' ||
            amenity.name === 'guest_toilet' ||
            amenity.name === 'guestroom' ||
            amenity.name === 'hair_dryer' ||
            amenity.name === 'hot_water_system' ||
            amenity.name === 'iron_iron_board' ||
            amenity.name === 'jacuzzi' ||
            amenity.name === 'kitchenette' ||
            amenity.name === 'microwave' ||
            amenity.name === 'hob_oven' ||
            amenity.name === 'patio' ||
            amenity.name === 'private_terrace' ||
            amenity.name === 'raised_floor' ||
            amenity.name === 'sauna' ||
            amenity.name === 'sea_view' ||
            amenity.name === 'security_door' ||
            amenity.name === 'shower' ||
            amenity.name === 'sitting_room' ||
            amenity.name === 'sofa_bed' ||
            amenity.name === 'private_swimming_pool' ||
            amenity.name === 'vacuum_cleaner' ||
            amenity.name === 'villa' ||
            amenity.name === 'washing_machine' ||
            amenity.name === 'water_pressure_system' ||
            amenity.name === 'window_blinds'
        ) {
            return amenity;
        } else {
            console.log();

        }
        return null;
    }).filter(amenity => amenity !== null);

    const amenitiesPropertyTranslated = amenitiesProperty.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesPropertyTranslatedSorted = amenitiesPropertyTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const amenitiesBuilidingFeatures = amenities.map(amenity => {
        if (amenity.name === 'parking' ||
            amenity.name === 'elevator_in_building' ||
            amenity.name === 'garden' ||
            amenity.name === 'swimming_pool'
        ) {
            return amenity;
        }
        return null;
    }
    ).filter(amenity => amenity !== null);

    const amenitiesBuilidingFeaturesTranslated = amenitiesBuilidingFeatures.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesBuilidingFeaturesTranslatedSorted = amenitiesBuilidingFeaturesTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const amenitiesAreaPlaces = amenities.map(amenity => {
        if (amenity.name === 'church' ||
            amenity.name === 'cinema' ||
            amenity.name === 'super_market'
        ) {
            return amenity;
        }
        return null;
    }
    ).filter(amenity => amenity !== null);

    const amenitiesAreaPlacesTranslated = amenitiesAreaPlaces.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesAreaPlacesTranslatedSorted = amenitiesAreaPlacesTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const amenitiesApartmentRules = amenities.map(amenity => {
        if (amenity.name === 'pets_allowed' ||
            amenity.name === 'no_pets_allowed' ||
            amenity.name === 'smoking_allowed' ||
            amenity.name === 'no_smoking_allowed' ||
            amenity.name === 'parties_allowed' ||
            amenity.name === 'no_parties_allowed' ||
            amenity.name === 'children_allowed' ||
            amenity.name === 'no_children_allowed' ||
            amenity.name === 'long_term_stay_allowed' ||
            amenity.name === 'suitable_for_events' ||
            amenity.name === 'suitable_for_disabled' ||
            amenity.name === 'check_in_after_3' ||
            amenity.name === 'check_out_before_11'
        ) {
            return amenity;
        }
        return null;
    }
    ).filter(amenity => amenity !== null);
    const amenitiesApartmentRulesTranslated = amenitiesApartmentRules.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })
    const amenitiesApartmentRulesTranslatedSorted = amenitiesApartmentRulesTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    const renderLabels = (amenities) => {
        const columns = [[], [], [], []];
        amenities.forEach((amenity, index) => {
            columns[index % 4].push(amenity);
        });
        return columns.map((column, colIndex) => (
            <Col key={colIndex} className="mx-auto p-2 text-start">
                {column.slice(0, 10).map((amenity) => {
                    // Ensure amenity.id is an integer for comparison
                    const amenityIdInt = typeof amenity.id === 'string' ? parseInt(amenity.id, 10) : amenity.id;
                    const isChecked = selectedAmenities?.includes(amenityIdInt);

                    return (
                        <div key={amenity.id} className="ms-5 p-2">
                            <label className="p-2 border shadow">
                                <input
                                    className="m-1"
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleAmenityChange(amenityIdInt)}
                                />
                                {amenity.name.replace(/_/g, " ")}
                            </label>
                        </div>
                    );
                })}
            </Col>
        ));
    }

    return (
        <>
            <Container>
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.shortTermPropertyAmenities')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesPropertyTranslatedSorted)}
                </Row>
                <hr />
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.shortTermBuildingAmenities')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesBuilidingFeaturesTranslatedSorted)}
                </Row>
                <hr />
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.shortTermAreaPlacesAmenities')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesAreaPlacesTranslatedSorted)}
                </Row>
                <hr />
                <Row className="justify-content-center mx-auto">
                    <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.shortTermApartmentRules')}</h4></Col>
                </Row>
                <Row className="justify-content-center mx-auto">
                    {renderLabels(amenitiesApartmentRulesTranslatedSorted)}
                </Row>

            </Container>
        </>
    )
}

export default AmenitiesShortTerm