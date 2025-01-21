import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import styles from '../../styles/Admin.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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
                console.log('response', response.data.results);

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
        <Container fluid>
            <Row className="m-4">

                <Table className={`${styles.Admin}`}>
                    <thead>
                        <tr>
                            <th>{t('First Name')}</th>
                            <th>{t('Last Name')}</th>
                            <th>{t('Phone')}</th>
                            <th>{t('Phone 2')}</th>
                            <th>{t('Email')}</th>
                            <th>{t('Notes')}</th>
                            <th>{t('Files')}</th>
                            <th style={{ backgroundColor: 'transparent', border: 'none' }}>
                                <Link to="/frontend/admin/listings/owners/create" className={`${btnStyles.AngryOcean} ${btnStyles.Button}`}>Add New Owner
                                </Link>

                            </th>
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
                                <td>
                                    <ul className={`list-unstyled ${styles.OwnerList}`}>
                                        {owner.files.map((file, index) => (
                                            <li key={index} className={`border rounded  p-1 mb-2 `}>
                                                <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                                                    {file.file_url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default AdminOwners;