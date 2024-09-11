import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/ListingCreateEditForm.module.css';


const ResidentialFields = ({ listingData, handleChange, history, errors, renderTextField }) => {
    return (
        <>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="floor_area">
                        <Form.Label>Floor Area (m²)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="floor_area"
                            value={listingData.floor_area}
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
                            value={listingData.land_area}
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
                    fieldName === "bedrooms" ||
                    fieldName === "kitchens" ||
                    fieldName === "bathrooms" ||
                    fieldName === "wc" ||
                    fieldName === "living_rooms" ||
                    fieldName === "floor" ||
                    fieldName === "levels" ||
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
                            value={listingData.energy_class}
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
                    <Form.Group controlId="floor_type">
                        <Form.Label>floor_type</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="floor_type"
                            value={listingData.floor_type}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="marble">Marble</option>
                            <option value="tile">Tile</option>
                            <option value="wooden">Wooden</option>
                            <option value="granite">Granite</option>
                            <option value="mosaic">Mosaic</option>
                            <option value="stone">Stone</option>
                            <option value="laminate">Laminate</option>
                            <option value="parquet">Parquet</option>
                            <option value="carpet">Carpet</option>
                            <option value="cement">Cement</option>
                            <option value="other">Other</option>

                        </Form.Control>
                    </Form.Group>
                    {errors?.view?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="type_of_glass">
                        <Form.Label>Type of Glass</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="type_of_glass"
                            value={listingData.type_of_glass}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="triple">Triple</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.type_of_glass?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="opening_frames">
                        <Form.Label>Opening Frames</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="opening_frames"
                            value={listingData.opening_frames}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="aluminium">Aluminium</option>
                            <option value="wooden">Wooden</option>
                            <option value="pvc">PVC</option>
                            <option value="iron">Iron</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.opening_frames?.map((message, idx) => (
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
                            value={listingData.construction_year}
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
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="service_charge">
                        <Form.Label>Service Charge {listingData.currency}</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="service_charge"
                            value={listingData.service_charge}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.service_charge?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
        </>
    )
}

export default ResidentialFields;