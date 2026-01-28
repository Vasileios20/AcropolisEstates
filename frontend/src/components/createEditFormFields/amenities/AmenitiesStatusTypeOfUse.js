import React from 'react'
import { useTranslation } from 'react-i18next';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const AmenitiesTypeOfUse = ({ amenities, create, selectedAmenities, handleAmenityChange }) => {
    const { t } = useTranslation();
    const amenitiesTypeOfUse = amenities.map(amenity => {
        if (amenity.name === 'suitable_for_development' ||
            amenity.name === 'suitable_for_office_use' ||
            amenity.name === 'suitable_for_commercial_use' ||
            amenity.name === 'suitable_for_residential_use' ||
            amenity.name === 'suitable_for_short_stay' ||
            amenity.name === 'suitable_for_warehouse_use' ||
            amenity.name === 'suitable_for_industrial_use' ||
            amenity.name === 'suitable_for_agricultural_use'
        ) {
            return amenity;
        }
        return null;
    }).filter(amenity => amenity !== null);

    const amenitiesTypeOfUseTranslated = amenitiesTypeOfUse.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesTypeOfUseTranslatedSorted = amenitiesTypeOfUseTranslated.sort((a, b) => {
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
                    const isChecked = selectedAmenities?.includes(amenityIdInt) || false;

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
    };

    return (
        <>
            <Row className="justify-content-center mx-auto">
                <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.type_of_use')}</h4></Col>
            </Row>
            <Row className="justify-content-center mx-auto">
                {renderLabels(amenitiesTypeOfUseTranslatedSorted)}
            </Row>
        </>
    )
}

export const AmenitiesStatus = ({ amenities, create, selectedAmenities, handleAmenityChange }) => {
    const { t } = useTranslation();
    const amenitiesStatus = amenities.map(amenity => {
        if (amenity.name === 'auction' ||
            amenity.name === 'under_offer' ||
            amenity.name === 'rented' ||
            amenity.name === 'sold' ||
            amenity.name === 'under_construction'
        ) {
            return amenity;
        }
        return null;
    }).filter(amenity => amenity !== null);

    const amenitiesStatusTranslated = amenitiesStatus.map(amenity => {
        return {
            ...amenity,
            name: t(`amenities.${amenity.name}`)
        }
    })

    const amenitiesStatusTranslatedSorted = amenitiesStatusTranslated.sort((a, b) => {
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
                    const isChecked = selectedAmenities?.includes(amenityIdInt) || false;

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
    };

    return (
        <>
            <Row className="justify-content-center mx-auto">
                <Col sm={6} className="m-auto"><h4>{t('createEditForm.headers.status')}</h4></Col>
            </Row>
            <Row className="justify-content-center mx-auto">
                {renderLabels(amenitiesStatusTranslatedSorted)}
            </Row>
        </>
    )
}