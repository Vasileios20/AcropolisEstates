import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useRedirect } from '../../hooks/useRedirect';
import useUserStatus from '../../hooks/useUserStatus';
import Forbidden403 from '../errors/Forbidden403';
import { axiosReq } from '../../api/axiosDefaults';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import btnStyles from '../../styles/Button.module.css';

const AdminOwners = () => {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    const [owners, setOwners] = useState([]);
    const { t } = useTranslation();
    const history = useHistory();

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axiosReq.get('/listings/owners/');
                setOwners(response.data.results);
            } catch (error) {
                console.error(error);
            }
        }
        fetchOwners();
    }, []);

    if (userStatus === false) {
        return <Forbidden403 />;
    }

    const handleRowClick = (id) => {
        history.push(`/frontend/admin/listings/owners/${id}`);
    }

    return (
        <Container fluid style={{ paddingTop: '90px' }}>
            <Row className="m-4">
                <Col className=" d-flex justify-content-end g-0 mb-3">
                    <Link to="/frontend/admin/listings/owners/create" className={`${btnStyles.AngryOcean} ${btnStyles.Button}`}>Add New Owner</Link>
                </Col>

                <Table>
                    <thead>
                        <tr>
                            <th>{t('First Name')}</th>
                            <th>{t('Last Name')}</th>
                            <th>{t('Phone')}</th>
                            <th>{t('Phone 2')}</th>
                            <th>{t('Email')}</th>
                            <th>{t('Notes')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {owners.map((owner, index) => (
                            <tr key={index} onClick={() => handleRowClick(owner.id)} style={{ cursor: 'pointer' }}>
                                <td>{owner.first_name}</td>
                                <td>{owner.last_name}</td>
                                <td>{owner.phone}</td>
                                <td>{owner.phone_2}</td>
                                <td>{owner.email}</td>
                                <td>{owner.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default AdminOwners;