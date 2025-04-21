import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import useUserStatus from "../../hooks/useUserStatus";

import { axiosRes } from "../../api/axiosDefaults";

import ListingImages from "./ListingImages";
import ListingHeader from "./ListingHeader";
import MapMarker from "../MapMarker";
import { StaffCard } from "./StaffCard";
import ShortTermBookingForm from "pages/bookings/ShortTermBookingForm";

import styles from "../../styles/Listing.module.css";
import btnStyles from "../../styles/Button.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

import { formatPriceValue, getFloorValue } from "utils/formatting";


const ShortTermListing = ({ setShowCookieBanner, nonEssentialConsent, ...props }) => {
  const history = useHistory();
  const userStatus = useUserStatus();
  const { t, i18n } = useTranslation();

  const {
    id,
    price,
    floor_area,
    bedrooms,
    floor,
    kitchens,
    bathrooms,
    wc,
    living_rooms,
    listingPage,
    images,
    longitude,
    latitude,
    amenities,
    currency,
  } = props;

  const lng = i18n.language;
  const [mapReady, setMapReady] = useState(false);
  const priceValue = formatPriceValue(price);
  const floorValue = getFloorValue(floor, t);

  const descriptionKey = lng === "el" ? "description_gr" : "description";
  const description = props[descriptionKey];
  const amenitiesArray = amenities?.map((a) => a.name) || [];

  const amenitiesList = amenitiesArray.map((amenity, id) => (
    <div key={id} className={`${styles.Amenity}`}>
      <span>{t(`amenities.${amenity}`)} </span>
      <i className={`fa-solid fa-square-check ${styles.AmenityChecked}`}></i>
    </div>
  ));

  const shortTermListing = (
    <Table className={`${styles.Listing__table} shadow`}>
      <tbody>
        {[
          { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
          { label: t("propertyDetails.floorArea"), value: `${floor_area} m²` },
          { label: t("propertyDetails.floorLevel"), value: floorValue },
          { label: t("propertyDetails.bedrooms"), value: bedrooms },
          { label: t("propertyDetails.kitchens"), value: kitchens },
          { label: t("propertyDetails.bathrooms"), value: bathrooms },
          { label: t("propertyDetails.wc"), value: wc },
          { label: t("propertyDetails.livingRooms"), value: living_rooms },
        ].map((feature, index) => (
          <tr key={index}>
            <td className={styles.tdWidth}>{feature.label}</td>
            <td>{feature.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  useEffect(() => {
    if (nonEssentialConsent && latitude !== undefined && longitude !== undefined) {
      setMapReady(true);
    }
  }, [nonEssentialConsent, latitude, longitude]);

  // Delete listing
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/short-term-listings/${id}/`);
      history.push(`/short-term-listings`)
    } catch (err) {
      // console.log(err);
    }
  };

  // Edit listing
  const handleEdit = () => {
    history.push(`/short-term-listings/${id}/edit`)
  };

  const [showBookingModal, setShowBookingModal] = useState(false);
  const handleClose = () => setShowBookingModal(false);
  const handleShow = () => setShowBookingModal(true);


  return (
    <>
      <Helmet>
        <title>{`Listing_AE000${props.id}`}</title>
        <meta name="keywords" content={`Features, amenities, real estate, Acropolis Estates, price, bedroom, apartment, name, floor, area, heating, email, acropolis, estates, london,  `} />
      </Helmet>
      <Container className="mt-5 pt-2">

        <ListingImages images={images} listing_id={id} amenities={amenities} />

        <Row className="justify-content-start">

          <Col lg={6} className="mb-3 h-100">
            <div className={styles.Listing__cardBodyListing}>
              <ListingHeader {...props} listingPage={listingPage} />
            </div>
            <div className="my-4">
              <h5>{lng === "el" ? t("propertyDetails.description_gr") : t("propertyDetails.description")}</h5>
              <p>{description}</p>
            </div>

          </Col>
          <Col lg={6} className="mb-3 ps-5 d-none d-lg-block">
            <Card className="shadow border-0 p-2">
              <Card.Body>
                <Card.Title className='text-center border-bottom mb-2 pb-1'>{t('bookingForm.title')}</Card.Title>
                <ShortTermBookingForm listingId={id} />
              </Card.Body>
            </Card>

          </Col>
        </Row>
        <Row>
          <h5>{t("propertiesPage.header1")}</h5>
          <Col lg={6} className="mb-3">

            {shortTermListing}

            <Col className="my-5">
              <h5 className="ps-2 pb-1">{t("propertiesPage.header2")}</h5>
              <div className={`${styles.AmenitiesBox}`}>{amenitiesList}</div>
            </Col>
            <Col className="mx-auto my-5">
              {mapReady && <MapMarker {...props} setShowCookieBanner={setShowCookieBanner} nonEssentialConsent={nonEssentialConsent} />}</Col>
            
          </Col>

          <Col lg={6} className="mb-3 ms-auto">
            {userStatus && (
              <Card className="shadow-sm border-0 p-3 mt-4">
                <StaffCard {...props} handleDelete={handleDelete} handleEdit={handleEdit} />
              </Card>
            )}
          </Col>

          <div className="d-lg-none">
            <div className={`${styles.stickyBookingForm} d-flex`}>
              <Button
                variant="primary"
                className={` ${btnStyles.AngryOcean} mt-3 mx-auto w-50`}
                onClick={handleShow}
              >
                {t("bookingForm.title")}
              </Button>

              <Modal show={showBookingModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>{t("bookingForm.title")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <ShortTermBookingForm listingId={id} />
                </Modal.Body>
              </Modal>
            </div>
          </div>

        </Row>
      </Container>
    </>
  );
};

export default ShortTermListing;
