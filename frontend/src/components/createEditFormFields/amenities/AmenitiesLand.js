import React from 'react'
import useFetchAmenities from '../../../hooks/useFetchAmenities'
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AmenitiesTypeOfUse } from './AmenitiesStatusTypeOfUse';
import { AmenitiesStatus } from './AmenitiesStatusTypeOfUse';


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
                    <Col sm={12} className="m-auto text-center"><h4>{t('createEditForm.headers.land')}</h4></Col>
                    <Col>
                        <Row className="justify-content-center">
                            {renderLabels(amenitiesLandTranslatedSorted)}
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