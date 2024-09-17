import React, { useState } from 'react'
import useFetchAllListings from '../../hooks/useFetchAllListings';
import styles from '../../styles/Admin.module.css';
import amenitiesStyles from "../../styles/Listing.module.css";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useHistory } from 'react-router-dom';
import Asset from '../../components/Asset';

export default function AdminListings() {

    const { listings, setListings, hasLoaded } = useFetchAllListings();
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    const history = useHistory();

    const handleRowClick = (id) => {
        history.push(`/listings/${id}`);
    }

    const handleSort = (sortType) => {
        let sortedListings = [...listings.results]; // Clone the array

        const direction = sortConfig.key === sortType && sortConfig.direction === 'asc' ? 'desc' : 'asc';

        sortedListings.sort((a, b) => {
            if (sortType === 'price' ||
                sortType === 'id' ||
                sortType === 'approved' ||
                sortType === 'featured' ||
                sortType === 'floor_area' ||
                sortType === 'land_area'
            ) {
                // Sorting numeric or boolean values
                return direction === 'asc' ? a[sortType] - b[sortType] : b[sortType] - a[sortType];
            } else {
                // Sorting string values (agent_name, type, sub_type, sale_type)
                return direction === 'asc'
                    ? a[sortType].localeCompare(b[sortType])
                    : b[sortType].localeCompare(a[sortType]);
            }
        });

        // Update the listings state with the sorted results
        setListings({ results: sortedListings });
        // Update the sort config state
        setSortConfig({ key: sortType, direction });
    }


    return (
        <Container fluid>
            <Row className="mx-2">
                <>
                    <div className={`${styles.Admin}`}>
                        <h1 className="text-center">Listings</h1>
                        {hasLoaded ?
                            <>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('agent_name')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'agent_name' ? 'bg-dark text-white' : ''}>Agent Name</th>
                                            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'id' ? 'bg-dark text-white' : ''}>ID</th>
                                            <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'type' ? 'bg-dark text-white' : ''}>Type</th>
                                            <th onClick={() => handleSort('sub_type')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'sub_type' ? 'bg-dark text-white' : ''}>Sub Type</th>
                                            <th onClick={() => handleSort('sale_type')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'sale_type' ? 'bg-dark text-white' : ''}>Sale Type</th>
                                            <th onClick={() => handleSort('floor_area')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'floor_area' ? 'bg-dark text-white' : ''}>Floor Area</th>
                                            <th onClick={() => handleSort('land_area')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'land_area' ? 'bg-dark text-white' : ''}>Land Area</th>
                                            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'price' ? 'bg-dark text-white' : ''}>Price</th>
                                            <th onClick={() => handleSort('approved')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'approved' ? 'bg-dark text-white' : ''}>Approved</th>
                                            <th onClick={() => handleSort('featured')} style={{ cursor: 'pointer' }} className={sortConfig.key === 'featured' ? 'bg-dark text-white' : ''}>Featured</th>
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
                                                <td>{listing.floor_area}</td>
                                                <td>{listing.land_area}</td>
                                                <td>{listing.price}</td>
                                                {listing.approved ? <td><i className={`fa-solid fa-square-check ${amenitiesStyles.AmenityChecked}`}></i></td> : <td></td>}
                                                {listing.featured ? <td><i className={`fa-solid fa-square-check ${amenitiesStyles.AmenityChecked}`}></i></td> : <td></td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                            : <><Asset spinner />
                            </>
                        }
                    </div>
                </>
            </Row>
        </Container>
    )
}
