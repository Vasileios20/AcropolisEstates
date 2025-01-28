import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import btnStyles from '../../styles/Button.module.css'
import styles from '../../styles/Admin.module.css'
import useFetchOwners from '../../hooks/useFetchOwners'
import { axiosReq } from '../../api/axiosDefaults'

export const StaffCard = ({ handleDelete, handleEdit, ...props }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { owners, setOwners } = useFetchOwners();
    const owner = owners.find(owner => owner.id === props?.listing_owner);


    const handleDeleteFile = async (fileId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this file?");
            if (confirmDelete) {
                await axiosReq.delete(`/owners/${owner.id}/files/${fileId}/`);
                const updatedOwners = owners.map(o => {
                    if (o.id === owner.id) {
                        return {
                            ...o,
                            files: o.files.filter(file => file.id !== fileId)
                        };
                    }
                    return o;
                });
                setOwners(updatedOwners);
            }
        } catch (error) {
            console.error("Error deleting file:", error.response?.data || error.message);
        }
    };


    return (
        <>
            <Col sm={12} className="mb-3">
                <Card className="h-100 shadow-sm">
                    <Card.Body>
                        <Card.Text>
                            <strong>Owner:</strong> {owner?.first_name} {owner?.last_name}
                        </Card.Text>
                        <Card.Text>
                            <strong>Phone:</strong> {owner?.phone}
                        </Card.Text>
                        {owner?.phone_2 &&
                            <Card.Text>
                                <strong>Phone 2:</strong> {owner?.phone_2}
                            </Card.Text>
                        }
                        <Card.Text>
                            <strong>Email:</strong> {owner?.email}
                        </Card.Text>
                        <Card.Text>
                            <strong>Notes:</strong> {owner?.notes}
                        </Card.Text>
                        <h5>Uploaded Files</h5>
                        <ul className={`list-unstyled ${styles.OwnerList}`}>
                            {owner?.files && owner?.files.length > 0 ? (
                                owner?.files.map((file, index) => (
                                    <li key={index} className="border rounded shadow p-1 mb-2 d-flex" style={{ maxWidth: '100%' }}>
                                        <a href={file.file} target="_blank" rel="noopener noreferrer">
                                            {file.file_url}
                                        </a>
                                        <Button
                                            className={`${btnStyles.Remove} ms-auto`}
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteFile(file.id)}
                                        >
                                            Delete
                                        </Button>
                                    </li>
                                ))
                            ) : (
                                <li>No files uploaded.</li>
                            )}
                        </ul>
                    </Card.Body>
                </Card>
            </Col>
            <Col sm={12} className="mb-3">
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
