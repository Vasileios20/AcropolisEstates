import React, { useEffect, useState, useMemo } from "react";
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
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

import { formatPriceValue, getFloorValue } from "utils/formatting";
import { OverlayTrigger, Tooltip } from "react-bootstrap";


const ShortTermListing = ({ setShowCookieBanner, nonEssentialConsent, ...props }) => {
  const history = useHistory();
  const userStatus = useUserStatus();
  const { t, i18n } = useTranslation();
  const [priceSummary, setPriceSummary] = useState({ nights: 0, total: null });

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
    vat_rate_display,
    municipality_tax_rate_display,
    climate_crisis_fee_per_night,
    vat_rate,
    municipality_tax_rate,
    service_fee,
    cleaning_fee,
  } = props;

  const listingTaxRates = useMemo(() => ({
    vatRate: vat_rate_display || 0,
    municipalityTaxRate: municipality_tax_rate_display || 0,
    serviceFee: service_fee || 0,
    vat: vat_rate || 0,
    municipalityTax: municipality_tax_rate || 0,
    climateCrisisFeeRate: climate_crisis_fee_per_night || 0,
    cleaningFee: cleaning_fee || 0,
  }), [
    vat_rate_display,
    municipality_tax_rate_display,
    vat_rate,
    municipality_tax_rate,
    service_fee,
    climate_crisis_fee_per_night,
    cleaning_fee
  ]);


  const lng = i18n.language;
  const [mapReady, setMapReady] = useState(false);
  const priceValue = formatPriceValue(price);
  const floorValue = getFloorValue(floor, t);


  const descriptionKey = lng === "el" ? "description_gr" : "description";
  const description = props[descriptionKey];
  const amenitiesArray = amenities?.map((a) => a.name) || [];

  const amenitiesBuilidingFeatures = [
    "parking",
    "elevator_in_building",
    "garden",
    "swimming_pool",
  ].map((amenity) => {
    if (amenitiesArray.includes(amenity)) {
      return t(`amenities.${amenity}`);
    }
    return null;
  });
  const amenitiesBuilidingFeaturesTranslated = amenitiesBuilidingFeatures.filter(Boolean);
  const amenitiesBuilidingFeaturesTranslatedList = amenitiesBuilidingFeaturesTranslated.map((amenity, id) => (
    <div key={id} className={`${styles.Amenity}`}>
      <span>{amenity} </span>
      {/* <i className={`fa-solid fa-square-check ${styles.AmenityChecked}`}></i> */}
    </div>
  ));
  const amenitiesAreaPlaces = [
    "church",
    "cinema",
    "super_market",
  ].map((amenity) => {
    if (amenitiesArray.includes(amenity)) {
      return t(`amenities.${amenity}`);
    }
    return null;
  });

  const amenitiesAreaPlacesTranslated = amenitiesAreaPlaces.filter(Boolean);
  const amenitiesAreaPlacesTranslatedList = amenitiesAreaPlacesTranslated.map((amenity, id) => (
    <div key={id} className={`${styles.Amenity}`}>
      <span>{amenity} </span>
      {/* <i className={`fa-solid fa-square-check ${styles.AmenityChecked}`}></i> */}
    </div>
  ));

  const amenitiesApartmentRules = [
    'check_in_after_3',
    'check_out_before_11',
    'pets_allowed',
    'no_pets_allowed',
    'smoking_allowed',
    'no_smoking_allowed',
    'parties_allowed',
    'no_parties_allowed',
    'children_allowed',
    'no_children_allowed',
    'long_term_stay_allowed',
    'suitable_for_events',
    'suitable_for_disabled',

  ].map((amenity) => {
    if (amenitiesArray.includes(amenity)) {
      return t(`amenities.${amenity}`);
    }
    return null;
  });
  const amenitiesApartmentRulesTranslated = amenitiesApartmentRules.filter(Boolean);
  const amenitiesApartmentRulesTranslatedList = amenitiesApartmentRulesTranslated.map((amenity, id) => (
    <div key={id} className={`${styles.Amenity}`}>
      <span>{amenity} </span>
      {/* <i className={`fa-solid fa-square-check ${styles.AmenityChecked}`}></i> */}
    </div>
  ));

  const amenitiesProperty = [
    'air_conditioning',
    'aluminum_shutters',
    'balcony',
    'bbq',
    'bathroom',
    'coffee_machine',
    'dining_room',
    'dishwasher',
    'en_suite_toilet',
    'equipment',
    'fireplace',
    'fire_detector',
    'fire_extinguisher',
    'fridge_freezer',
    'guest_toilet',
    'guestroom',
    'hair_dryer',
    'hot_water_system',
    'iron_iron_board',
    'jacuzzi',
    'kitchenette',
    'microwave',
    'hob_oven',
    'patio',
    'private_terrace',
    'raised_floor',
    'sauna',
    'sea_view',
    'security_door',
    'shower',
    'sitting_room',
    'sofa_bed',
    'private_swimming_pool',
    'vacuum_cleaner',
    'villa',
    'washing_machine',
    'water_pressure_system',
    'window_blinds'
  ].map((amenity) => {
    if (amenitiesArray.includes(amenity)) {
      return t(`amenities.${amenity}`);
    }
    return null;
  });

  const amenitiesPropertyTranslated = amenitiesProperty.filter(Boolean);
  const amenitiesPropertyTranslatedList = amenitiesPropertyTranslated.map((amenity, id) => (
    <div key={id} className={`${styles.Amenity}`}>
      <span>{amenity} </span>
      {/* <i className={`fa-solid fa-square-check ${styles.AmenityChecked}`}></i> */}
    </div>
  ));



  const shortTermListing = (
    <div className={`${styles.Listing__features}`}>
      <div className="d-flex flex-wrap">
        {[
          // { label: t("propertyDetails.price"), value: `${currency}${priceValue}`, icon: "fa-tag" },
          { label: t("propertyDetails.floorArea"), value: `${floor_area}m²`, icon: "fa-ruler-combined" },
          { label: t("propertyDetails.floorLevel"), value: floorValue, icon: "fa-stairs" },
          { label: t("propertyDetails.bedrooms"), value: bedrooms, icon: "fa-bed" },
          { label: t("propertyDetails.kitchens"), value: kitchens, icon: "fa-utensils" },
          { label: t("propertyDetails.bathrooms"), value: bathrooms, icon: "fa-bath" },
          { label: t("propertyDetails.wc"), value: wc, icon: "fa-toilet" },
          { label: t("propertyDetails.livingRooms"), value: living_rooms, icon: "fa-couch" }
        ].map((feature, index) => {
          const renderTooltip = (props) => (
            <Tooltip
              id="button-tooltip"
              {...props}
            >
              {feature.label} {feature.value}
            </Tooltip>
          );

          return (
            <OverlayTrigger
              key={index}
              placement="bottom"
              delay={{ show: 250, hide: 200 }}
              overlay={renderTooltip}
              trigger={["hover", "focus"]}
            >
              <div className={`mx-1 p-2 ${styles.Amenity} d-flex align-items-center mb-3`}>
                <i className={`fa-solid ${feature.icon} ${styles.FeatureIcon} pe-1`}></i>
                <span className={styles.FeatureValue}> {feature.value}</span>
              </div>
            </OverlayTrigger>
          );
        })}
      </div>
    </div>
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
          {/* Main Content Column */}
          <Col lg={7} xl={8} className="mb-3">
            <div className={styles.Listing__cardBodyListing}>
              <ListingHeader {...props} listingPage={listingPage} />
            </div>

            <div className="my-4">
              <h5>{lng === "el" ? t("propertyDetails.description_gr") : t("propertyDetails.description")}</h5>
              <p>{description}</p>
            </div>

            <h5>{t("propertiesPage.header1")}</h5>
            {shortTermListing}

            <div className="my-5">
              <h5 className="ps-2 pb-1">{t("amenities.header.apartmentAmenities")}</h5>
              <div className={`${styles.AmenitiesBox}`}>{amenitiesPropertyTranslatedList}</div>

              <h5 className="ps-2 pt-3 pb-1">{t("amenities.header.buildingAmenities")}</h5>
              <div className={`${styles.AmenitiesBox}`}>{amenitiesBuilidingFeaturesTranslatedList}</div>

              <h5 className="ps-2 pt-3 pb-1">{t("amenities.header.areaPlacesAmenities")}</h5>
              <div className={`${styles.AmenitiesBox}`}>{amenitiesAreaPlacesTranslatedList}</div>

              <h5 className="ps-2 pt-3 pb-1">{t("amenities.header.apartmentRules")}</h5>
              <div className={`w-50`}>{amenitiesApartmentRulesTranslatedList}</div>
            </div>

            <div className="mx-auto my-5">
              {mapReady && <MapMarker {...props} setShowCookieBanner={setShowCookieBanner} nonEssentialConsent={nonEssentialConsent} />}
            </div>

            {userStatus && (
              <Card className="shadow-sm border-0 p-3 mt-4">
                <StaffCard {...props} handleDelete={handleDelete} handleEdit={handleEdit} />
              </Card>
            )}
          </Col>

          {/* Sticky Booking Form Column */}
          <Col lg={5} xl={4} className="mb-3 d-none d-lg-block">
            <div className={styles.stickyBookingForm}>
              <Card className="shadow border-0 p-2">
                <Card.Body>
                  <Card.Title className='text-center border-bottom mb-2 pb-1'>
                    {t('bookingForm.title')}
                  </Card.Title>
                  <ShortTermBookingForm
                    listingId={id}
                    onPriceUpdate={setPriceSummary}
                    listingTaxRates={listingTaxRates}
                  />
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Mobile Sticky Booking Bar */}
        <div className="d-lg-none">
          <div
            className={styles.stickyMobileBooking}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTop: '1px solid #e0e0e0',
              padding: '12px 16px',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {priceSummary.total !== null ? (
                  <>
                    <div className="fw-bold fs-5">
                      {currency}{priceSummary.total.toFixed(2)}
                    </div>
                    <small className="text-muted">
                      {priceSummary.nights} {priceSummary.nights > 1 ? t("bookingForm.nights") : t("bookingForm.night")}
                    </small>
                  </>
                ) : (
                  <>
                    <div className="fw-bold fs-5">
                      {currency}{priceValue}
                    </div>
                    <small className="text-muted">
                      {t("bookingForm.perNight")}
                    </small>
                  </>
                )}
              </div>

              <Button
                variant="primary"
                className={btnStyles.AngryOcean}
                onClick={handleShow}
                style={{
                  padding: '10px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {t("bookingForm.checkAvailability")}
              </Button>
            </div>
          </div>

          {/* Spacer so content isn't hidden */}
          <div style={{ height: '80px' }}></div>

          <Modal show={showBookingModal} onHide={handleClose} centered fullscreen="sm-down">
            <Modal.Header closeButton>
              <Modal.Title>{t("bookingForm.title")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ShortTermBookingForm
                listingId={id}
                onPriceUpdate={setPriceSummary}
                listingTaxRates={listingTaxRates}
              />
            </Modal.Body>
          </Modal>
        </div>
      </Container>
    </>
  );
};

export default ShortTermListing;
