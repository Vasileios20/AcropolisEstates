import React from 'react'
import useFetchAmenities from '../../../hooks/useFetchAmenities'
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AmenitiesTypeOfUse } from './AmenitiesTypeOfUse';


export const AmenitiesLand = (
    {
        handleAmenityChange,
        selectedAmenities,
        create
    }) => {
    const { amenities } = useFetchAmenities()
    const { t } = useTranslation();

    const amenitiesLand = amenities.map(amenity => {
        if (amenity.name === 'property_consideration' ||
            amenity.name === 'inside_the_settlement' ||
            amenity.name === 'facade'
        ) {
            return amenity;
        }
        return null;
    }).filter(amenity => amenity !== null);

    const amenitiesLandTranslated = amenitiesLand.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesLandTranslatedSorted = amenitiesLandTranslated.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    return (
        <>
            <Container>
                <Row className="justify-content-center mx-auto">
                    <Col sm={12} className="m-auto text-center"><h4>{t('createEditForm.headers.land')}</h4></Col>
                    <Col>
                        <Row className="justify-content-center">
                            {amenitiesLandTranslatedSorted.map((amenity) => (
                                <Col sm={3} key={amenity.id} className="m-1 p-2 text-center">
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
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
                <hr />
                <AmenitiesTypeOfUse
                    amenities={amenities}
                    create={create}
                    selectedAmenities={selectedAmenities}
                    handleAmenityChange={handleAmenityChange}
                />
            </Container>
        </>
    )
}
