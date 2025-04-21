import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

import styles from "../../styles/ListingCreateEditForm.module.css";
import OwnerCreateForm from "../../pages/admin/OwnerCreateForm";

const Owner = ({
    listingData,
    handleChange,
    handleShow,
    handleClose,
    show,
    owners,
    errors,
}) => {
    return (
        <Row className="justify-content-center">
            <Col md={6}>
                <Form.Group controlId="owner">
                    <Form.Label>Owner</Form.Label>
                    <Form.Control
                        className={styles.Input}
                        as="select"
                        name="listing_owner"
                        value={listingData.listing_owner}
                        onChange={(e) => {
                            handleChange(e);
                            if (e.target.value === "create_new") {
                                handleShow();
                            }
                        }}
                    >
                        <option>---</option>
                        <option value="create_new">Create New Owner</option>
                        {owners?.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                                {owner.first_name} {owner.last_name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                {listingData?.listing_owner === "create_new" && (
                    <Modal
                        show={show}
                        onHide={handleClose}
                        centered
                    >
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body
                            className={`${styles.Modal}`}>
                            <Row className="justify-content-center w-100">
                                <OwnerCreateForm />
                            </Row>
                        </Modal.Body>
                    </Modal>
                )}
                {errors?.listing_owner?.map((message, idx) => (
                    <Alert className={styles.Input} variant="warning" key={idx}>
                        {message}
                    </Alert>
                ))}
            </Col>
        </Row>
    )
}

export default Owner