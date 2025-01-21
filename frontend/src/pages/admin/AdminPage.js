import React from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import styles from '../../styles/Admin.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import { useRedirect } from '../../hooks/useRedirect';
import useUserStatus from '../../hooks/useUserStatus';
import Forbidden403 from '../errors/Forbidden403';

const AdminPage = () => {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    if (userStatus === false) {
        return <Forbidden403 />;
    }
    return (

        <Container>
            <Row className="m-4">
                <Table className={`${styles.Admin}`}>
                    <tbody>
                        <tr>
                            <td>
                                <Link to="/frontend/admin/listings/owners">Owners</Link>
                            </td>
                        </tr>
                        <tr>
                            <td className="d-flex">
                                <Link to="/frontend/admin/listings">Listings</Link>

                                <Link to="/listings/create" className="ms-auto">Add Listing </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Link to="/contact_list">Messages</Link>
                            </td>
                        </tr>

                    </tbody>

                </Table>
            </Row>
        </Container>

    );
}

export default AdminPage;