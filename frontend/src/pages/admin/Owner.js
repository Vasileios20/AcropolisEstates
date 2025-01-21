import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import { useParams } from "react-router";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import useUserStatus from "../../hooks/useUserStatus";
import Forbidden403 from "../errors/Forbidden403";
import styles from "../../styles/Admin.module.css";

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

    return (
        <>
            {currentUser && (
                <Container className="mt-5 pt-5">
                    <Row>
                        <Col className="my-2">
                            <Card className="my-2">
                                <Card.Header>
                                    <>
                                        
                                    </>
                                    <h1>{modifiedFirstName} Profile Page</h1>
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
                                                            <a href={file.file_url} target="_blank" rel="noopener noreferrer">
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
                    </Row>
                </Container>
            )}
        </>
    );
}

export default OwnerPage;
