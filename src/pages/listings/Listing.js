import React, { useEffect, useState } from "react";

import styles from "../../styles/Listing.module.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

import { Link, useHistory } from "react-router-dom";
import ListingImages from "./ListingImages";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropDown";
import ListingHeader from "../../components/ListingHeader";
import useUserStatus from "../../hooks/useUserStatus";
import ContactForm from "../contact/ContactForm";
import { useTranslation } from "react-i18next";
import MapMarker from "../../components/MapMarker";

const Listing = (props) => {
  /**
   * The Listing component is a functional component that renders the details of a listing.
   * It receives the following props:
   * - id: number
   * - owner: string
   * - profile_id: number
   * - price: number
   * - surface: number
   * - levels: number
   * - bedrooms: number
   * - floor: number
   * - kitchens: number
   * - bathrooms: number
   * - living_rooms: number
   * - heating_system: string
   * - energy_class: string
   * - construction_year: number
   * - availability: string
   * - created_at: string
   * - updated_at: string
   * - listingPage: boolean
   * - images: array
   * - setListings: function
   * - longitude: number
   * - latitude: number
   * @returns {JSX.Element} - The JSX for the component.
   */

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lng = navigator.language || navigator.userLanguage;
    i18n.changeLanguage(lng);
  }, [i18n]);

  const {
    id,
    owner,
    profile_id,
    price,
    surface,
    levels,
    bedrooms,
    floor,
    kitchens,
    bathrooms,
    living_rooms,
    heating_system,
    energy_class,
    construction_year,
    availability,
    created_at,
    updated_at,
    listingPage,
    images,
    longitude,
    latitude,
  } = props;

  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Check if latitude and longitude are defined
    if (latitude !== undefined && longitude !== undefined) {
      setMapReady(true);
    }
  }, [latitude, longitude]);

  const history = useHistory();
  const userStatus = useUserStatus();

  // Delete listing
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/listings/${id}/`);
      history.push("/listings");
    } catch (err) {
      // console.log(err);
    }
  };

  // Edit listing
  const handleEdit = () => {
    history.push(`/listings/${id}/edit`);
  };

  const staffCard = (
    <>
      <Card.Body>
        <Card.Text>
          <Link to={`/profiles/${profile_id}`}>Owner: {owner}</Link>
        </Card.Text>

        <Card.Text>Created at: {created_at}</Card.Text>
        <Card.Text>Updated at: {updated_at}</Card.Text>
      </Card.Body>
    </>
  );

  const floorValue =
    floor < 0
      ? "Basement"
      : floor === 0
        ? "Ground floor"
        : floor === 1
          ? `${floor}st `
          : floor === 2
            ? `${floor}nd `
            : floor === 3
              ? `${floor}rd `
              : `${floor}th `;

  return (
    <>
      <Row className="align-items-center">
        <Col lg={8}>
          <ListingImages images={images} listing_id={id} />
        </Col>
        <Col md={4}>
          <ContactForm listing_id={id} />
        </Col>
      </Row>
      <Row>
        <Col md={4}>{userStatus && staffCard}</Col>
        <Col md={4} className="d-flex mt-4">
          {userStatus && (
            <MoreDropdown handleDelete={handleDelete} handleEdit={handleEdit} />
          )}
        </Col>
        <ListingHeader {...props} listingPage={listingPage} />
        <h5>{t("propertyDetails.description")}</h5>
        <p>
          {props.description}
        </p>


        <Col lg={4} className="">
          <h5>Features</h5>
          <Table className={styles.Listing__table}>
            <tbody>
              <tr>
                <td className={styles.tdWidth}>
                  {t("propertyDetails.price")}{" "}
                </td>
                <td>£ {price}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.floorArea")} </td>
                <td>
                  {surface} m<sup>2</sup>
                </td>
              </tr>
              <tr>
                <td>{t("propertyDetails.levels")} </td>
                <td>{levels}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.bedrooms")} </td>
                <td>{bedrooms}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.floorLevel")} </td>
                <td>{floorValue}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.kitchens")} </td>
                <td>{kitchens}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.bathrooms")} </td>

                <td>{bathrooms}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.livingRooms")} </td>
                <td>{living_rooms}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.heating")} </td>
                <td>{heating_system}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.energyClass")} </td>
                <td>{energy_class}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.yearBuilt")} </td>
                <td>{construction_year}</td>
              </tr>
              <tr>
                <td>{t("propertyDetails.availability")} </td>
                <td>{availability}</td>
              </tr>
              <tr>
                <td>Listing id</td>
                <td>{id}</td>
              </tr>
            </tbody>
          </Table>

        </Col>
      </Row>
      <Row className="justify-content-between">
        <Col md={6}>
          {mapReady && <MapMarker {...props} />}
        </Col>

      </Row >
    </>
  );
};

export default Listing;
