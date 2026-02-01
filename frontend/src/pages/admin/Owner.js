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
import useFetchOwners from "../../hooks/useFetchOwners";
import { useTranslation } from "react-i18next";


function OwnerPage() {
    useRedirect("loggedOut");
    const { id } = useParams();
    const currentUser = useCurrentUser();
    const userStatus = useUserStatus();
    const { t } = useTranslation();

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
    const { owners } = useFetchOwners();

    useEffect(() => {
        setOwnersData(owners.find((owner) => owner.id === parseInt(id)));
    }, [owners, id]);

    const handleDeleteFile = async (fileId) => {
        try {
            const confirmDelete = window.confirm(t("admin.owner.confirmDelete"));
            if (confirmDelete) {
                await axiosReq.delete(`/owners/${ownersData.id}/files/${fileId}/`);
                const updatedFiles = ownersData.files.filter(file => file.id !== fileId);
                setOwnersData(prevData => ({
                    ...prevData,
                    files: updatedFiles
                }));
            }
        } catch (error) {
            console.error(t("admin.owner.errorDeletingFile"), error.response?.data || error.message);
        }
    };


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
                                        <div className="ms-4" style={{ cursor: 'pointer', color: '#a00000' }}>
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
                                                {t("admin.owner.email")}: {ownersData?.email}
                                                <br />
                                                {t("admin.owner.phone")}: {ownersData?.phone}
                                                <br />
                                                {t("admin.owner.secondaryPhone")}: {ownersData?.phone_2}
                                                <br />
                                                {t("admin.owner.notes")}: {ownersData?.notes}

                                            </Card.Text>
                                            <h5>{t("admin.owner.uploadedFiles")}</h5>
                                            <ol className={`${styles.OwnerList}`}>
                                                {ownersData?.files && ownersData?.files.length > 0 ? (
                                                    ownersData?.files.map((file, index) => (
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
                                                                {t("admin.owner.delete")}
                                                            </Button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>{t("admin.owner.noFilesUploaded")}</li>
                                                )}
                                            </ol>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Modal show={show} onHide={handleClose} centered size="md" className="text-center">
                            <Modal.Header closeButton className="text-dark border-dark" style={{ backgroundColor: 'rgba(132, 124, 61, 0.85)' }}>
                                <Modal.Title>{t("admin.owner.deleteOwner")}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-dark" style={{ backgroundColor: '#847c3d' }}>
                                <p className="h3" > {t("admin.owner.confirmDeleteOwner")}</p>
                                <p className="h5">{t("admin.owner.cannotUndo")}</p>
                            </Modal.Body>
                            <Modal.Footer className="text-dark d-flex justify-content-center border-dark" style={{ backgroundColor: 'rgba(132, 124, 61, 0.85)' }}>
                                <Button className={`${btnStyles.AngryOcean} ${btnStyles.Button}`} onClick={handleClose}>
                                    {t("admin.owner.close")}
                                </Button>
                                <Button className={`${btnStyles.Remove} ${btnStyles.Button}`} onClick={handleDelete}>
                                    {t("admin.owner.deleteOwner")}
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

