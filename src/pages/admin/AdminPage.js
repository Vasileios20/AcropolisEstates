import React from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import styles from '../../styles/Admin.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const AdminPage = () => {
    return (

        <Container>
            <Row className="m-4">
                <Table className={`${styles.Admin}`}>
                    <tbody>
                        <tr>
                            <td>
                                <Link to="/admin/users">Users</Link>
                            </td>
                        </tr>
                        <tr>
                            <td className="d-flex">
                                <Link to="/admin/listings">Listings</Link>

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