import React from 'react'
import useFetchListings from '../../hooks/useFetchListings';
import styles from '../../styles/Admin.module.css';
import amenitiesStyles from "../../styles/Listing.module.css";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';

export default function AdminListings() {

    const { listings, setListings, hasLoaded } = useFetchListings();

    const history = useHistory();

    const handleRowClick = (id) => {
        history.push(`/listings/${id}`);
    }



    return (
        <Container fluid>
            <Row className="mx-2">
                <div className={`${styles.Admin}`}>
                    <h1>Listings</h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>Agent Name</th>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Sub Type</th>
                                <th>Sale Type</th>
                                <th>Price</th>
                                <th>Approved</th>
                                <th>Featured</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listings.results.map(listing => (
                                <tr key={listing.id} onClick={() => handleRowClick(listing.id)} style={{ cursor: 'pointer' }}>
                                    <td>{listing.agent_name}</td>
                                    <td>{listing.id}</td>
                                    <td>{listing.type}</td>
                                    <td>{listing.sub_type}</td>
                                    <td>{listing.sale_type}</td>
                                    <td>{listing.price}</td>
                                    {listing.approved ? <td><i className={`fa-solid fa-square-check ${amenitiesStyles.AmenityChecked}`}></i></td> : <td></td>}
                                    {listing.featured ? <td><i className={`fa-solid fa-square-check ${amenitiesStyles.AmenityChecked}`}></i></td> : <td></td>}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

            </Row>
        </Container>
    )
}
