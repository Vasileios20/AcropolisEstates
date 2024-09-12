import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/ListingCreateEditForm.module.css';


const CommercialFields = ({ listingData, handleChange, history, errors, renderTextField }) => {
    return (
        <>
            <h1>Commercial Features</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="floor_area">
                        <Form.Label>Floor Area (m²)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="floor_area"
                            value={listingData.floor_area || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.floor_area?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="land_area">
                        <Form.Label>Land Area (m²)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="land_area"
                            value={listingData.land_area || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.land_area?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            {Object.entries(listingData).map(([fieldName, fieldValue]) => {
                if (
                    fieldName === "levels" ||
                    fieldName === "floor" ||
                    fieldName === "rooms" ||
                    fieldName === "bathrooms" ||
                    fieldName === "wc" ||
                    fieldName === "heating_system" ||
                    fieldName === "heating_system_gr"
                ) {
                    return (
                        <Row className="justify-content-center" key={fieldName}>
                            <Col md={6}>
                                {renderTextField(fieldName, fieldName.charAt(0).toUpperCase() + fieldName.slice(1))}
                            </Col>
                        </Row>
                    );
                }
                return null;
            })}
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="energy_class">
                        <Form.Label>Energy class</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="energy_class"
                            value={listingData.energy_class || ""}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            {Array.from("ABCDEFG").map((letter) => (
                                <option key={letter}>{letter}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {errors?.energy_class?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="power_type">
                        <Form.Label>Power Type</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="text"
                            name="power_type"
                            value={listingData.power_type || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.power_type?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="power_type_gr">
                        <Form.Label>Power Type gr</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="text"
                            name="power_type_gr"
                            value={listingData.power_type_gr || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.power_type_gr?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="construction_year">
                        <Form.Label>Construction Year</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="construction_year"
                            value={listingData.construction_year || ""}
                            onChange={handleChange}
                        >
                            {Array.from(
                                { length: new Date().getFullYear() - 1899 },
                                (_, i) => i + 1900
                            ).map((year) => (
                                <option key={year}>{year}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {errors?.construction_year?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
        </>
    )
}

export default CommercialFields;