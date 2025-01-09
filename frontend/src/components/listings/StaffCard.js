import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import btnStyles from '../../styles/Button.module.css'

export const StaffCard = ({ handleDelete, handleEdit, ...props }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Col md={5} className="mb-3">
                <Card className="h-100 shadow-sm">
                    <Card.Body>
                        <Card.Text>
                            <strong>Owner:</strong> {props?.listing_owner?.first_name} {props.listing_owner?.last_name}
                        </Card.Text>
                        <Card.Text>
                            <strong>Phone:</strong> {props.listing_owner?.phone}
                        </Card.Text>
                        {props.listing_owner?.phone_2 &&
                            <Card.Text>
                                <strong>Phone 2:</strong> {props.listing_owner?.phone_2}
                            </Card.Text>
                        }
                        <Card.Text>
                            <strong>Email:</strong> {props.listing_owner?.email}
                        </Card.Text>
                        <Card.Text>
                            <strong>Notes:</strong> {props.listing_owner?.notes}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={5} className="mb-3">
                <Card className="h-100 shadow-sm">
                    <Card.Body>
                        <Card.Text>
                            <Link to={`/profiles/${props.profile_id}`} className="text-decoration-none">
                                <strong>Agent:</strong> {props.agent_name}
                            </Link>
                        </Card.Text>
                        <Card.Text>
                            <strong>Created on:</strong> {props.created_on}
                        </Card.Text>
                        <Card.Text>
                            <strong>Updated on:</strong> {props.updated_on}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={2} className="d-flex flex-column justify-content-between mb-3">
                <Button className={`${btnStyles.Remove} mb-2`} onClick={handleShow}>
                    <i className="fas fa-trash-alt"></i>
                </Button>
                <Button className={btnStyles.AngryOcean} onClick={handleEdit}>
                    <i className="fas fa-edit"></i>
                </Button>
            </Col>
            <Modal show={show} onHide={handleClose} centered size="md" className="text-center">
                <Modal.Header closeButton className="text-dark border-dark" style={{ backgroundColor: 'rgba(132, 124, 61, 0.85)' }}>
                    <Modal.Title>Delete listing</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-dark" style={{ backgroundColor: '#847c3d' }}>
                    <p className="h3" > Are you sure you want to delete this listing?</p>
                    <p className="h5">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer className="text-dark d-flex justify-content-center border-dark" style={{ backgroundColor: 'rgba(132, 124, 61, 0.85)' }}>
                    <Button className={`${btnStyles.AngryOcean} ${btnStyles.Button}`} onClick={handleClose}>
                        Close
                    </Button>
                    <Button className={`${btnStyles.Remove} ${btnStyles.Button}`} onClick={handleDelete}>
                        Delete listing
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
