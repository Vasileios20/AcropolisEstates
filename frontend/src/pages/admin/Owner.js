import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { useParams } from "react-router";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { useHistory } from "react-router-dom";
import { useRedirect } from "../../hooks/useRedirect";
import useUserStatus from "../../hooks/useUserStatus";
import Forbidden403 from "../errors/Forbidden403";
import styles from "../../styles/Admin.module.css";
import btnStyles from "../../styles/Button.module.css";


function OwnerPage() {
    useRedirect("loggedOut");
    const { id } = useParams();
    const currentUser = useCurrentUser();
    const userStatus = useUserStatus();

    const [ownersData, setOwnersData] = useState({
        id: "",
        first_name: "",
        last_name: "",
        email_address: "",
        phone: "",
        phone_2: "",
        notes: "",
    });
    const history = useHistory();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axiosReq.get(`/listings/owners/${id}/`);
                setOwnersData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchOwners();
    }, [id]);

    if (userStatus === false) {
        return <Forbidden403 />;
    }

    const onwerFirstName = ownersData?.first_name;
    const modifiedFirstName = onwerFirstName?.endsWith('s') ? onwerFirstName + "'" : onwerFirstName + "'s";

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/listings/owners/${id}/`);
            history.push("/frontend/admin/listings/owners/");
        } catch (err) {
            // console.log(err);
        }
    };

    return (
        <>
            {currentUser && (
                <Container className="mt-5 pt-5">
                    <Row>
                        <Col className="my-2">
                            <Card className="my-2">
                                <Card.Header>
                                    <h1 className="text-center">{modifiedFirstName} Info </h1>
                                   
                                    <div className="d-flex justify-content-end">
                                        <div className="me-auto">
                                            
                                            <Link to="/frontend/admin/listings/owners"><i className="fas fa-arrow-left" /> Back</Link>

                                        </div>
                                        <div>
                                            <Link to={`/frontend/admin/listings/owners/${id}/edit`}><i className="fas fa-edit" /></Link>

                                        </div>
                                        <div className="ms-4" style={{ cursor: 'pointer', color : '#a00000' }}>
                                            <i className="fas fa-trash" onClick={handleShow} />

                                        </div>

                                    </div>

                                </Card.Header>
                                <Card.Body>
                                    <Row>

                                        <Col md={8}>
                                            <Card.Title>
                                                {ownersData?.first_name} {ownersData?.last_name}
                                            </Card.Title>
                                            <Card.Text>
                                                Email: {ownersData?.email}
                                                <br />
                                                Phone: {ownersData?.phone}
                                                <br />
                                                Phone 2: {ownersData?.phone_2}
                                                <br />
                                                Notes: {ownersData?.notes}

                                            </Card.Text>
                                            <h5>Uploaded Files</h5>
                                            <ol className={`${styles.OwnerList}`}>
                                                {ownersData?.files && ownersData?.files.length > 0 ? (
                                                    ownersData?.files.map((file, index) => (
                                                        <li key={index} className="border rounded shadow p-1 mb-2">
                                                            <a href={file.file} target="_blank" rel="noopener noreferrer">
                                                                {file.file_url}
                                                            </a>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No files uploaded.</li>
                                                )}
                                            </ol>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Modal show={show} onHide={handleClose} centered size="md" className="text-center">
                            <Modal.Header closeButton className="text-dark border-dark" style={{ backgroundColor: 'rgba(132, 124, 61, 0.85)' }}>
                                <Modal.Title>Delete Owner</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-dark" style={{ backgroundColor: '#847c3d' }}>
                                <p className="h3" > Are you sure you want to delete this Owner?</p>
                                <p className="h5">This action cannot be undone.</p>
                            </Modal.Body>
                            <Modal.Footer className="text-dark d-flex justify-content-center border-dark" style={{ backgroundColor: 'rgba(132, 124, 61, 0.85)' }}>
                                <Button className={`${btnStyles.AngryOcean} ${btnStyles.Button}`} onClick={handleClose}>
                                    Close
                                </Button>
                                <Button className={`${btnStyles.Remove} ${btnStyles.Button}`} onClick={handleDelete}>
                                    Delete Owner
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Row>
                </Container>
            )}
        </>
    );
}

export default OwnerPage;
