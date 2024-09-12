import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import styles from '../../styles/ListingCreateEditForm.module.css';


const LandFields = ({ listingData, handleChange, history, errors, renderTextField }) => {
    return (
        <>
            <h1>Land Features</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="cover_coefficient">
                        <Form.Label>Cover Coefficient (%)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="cover_coefficient"
                            value={listingData.cover_coefficient}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.cover_coefficient?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="building_coefficient">
                        <Form.Label>Building Coefficient (%)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="building_coefficient"
                            value={listingData.building_coefficient}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.building_coefficient?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="length_of_facade">
                        <Form.Label>Length of Facade (m)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="length_of_facade"
                            value={listingData.length_of_facade}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.length_of_facade?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="orientation">
                        <Form.Label>Orientation</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="orientation"
                            value={listingData.orientation}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="north">North</option>
                            <option value="north_east">North East</option>
                            <option value="east">East</option>
                            <option value="south_east">South East</option>
                            <option value="south">South</option>
                            <option value="south_west">South West</option>
                            <option value="west">West</option>
                            <option value="north_west">North West</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.orientation?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="view">
                        <Form.Label>View</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="view"
                            value={listingData.view}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="sea">Sea</option>
                            <option value="mountain">Mountain</option>
                            <option value="city">City</option>
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
                    <Form.Group controlId="slope">
                        <Form.Label>Slope</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="slope"
                            value={listingData.slope}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="level">Level</option>
                            <option value="view">View</option>
                            <option value="incline">Incline</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.slope?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="zone">
                        <Form.Label>Zone</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            as="select"
                            name="zone"
                            value={listingData.zone}
                            onChange={handleChange}
                        >
                            <option>---</option>
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                            <option value="agricultural">Agricultural</option>
                            <option value="tourist">Tourist</option>
                            <option value="mixed">Mixed</option>
                            <option value="redevelopment">Redevelopment</option>
                            <option value="other">Other</option>
                        </Form.Control>
                    </Form.Group>
                    {errors?.zone?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form.Group controlId="distance_from_sea">
                        <Form.Label>Distance from sea (m)</Form.Label>
                        <Form.Control
                            className={styles.Input}
                            type="number"
                            name="distance_from_sea"
                            value={listingData.distance_from_sea}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    {errors?.distance_from_sea?.map((message, idx) => (
                        <Alert className={styles.Input} variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                </Col>
            </Row>
        </>
    )
}

export default LandFields;