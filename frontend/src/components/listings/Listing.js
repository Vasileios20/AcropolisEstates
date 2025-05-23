import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { axiosRes } from "../../api/axiosDefaults";
import { useTranslation } from "react-i18next";
import ListingImages from "./ListingImages";
import ListingHeader from "./ListingHeader";
import useUserStatus from "../../hooks/useUserStatus";
import ContactForm from "../../pages/contact/ContactForm";
import MapMarker from "../MapMarker";

import styles from "../../styles/Listing.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { StaffCard } from "./StaffCard";
import MortgagePaymentCalculator from "../MortgagePaymentCalculator";
import Brochure from "components/Brochure";


const Listing = ({ setShowCookieBanner, nonEssentialConsent, ...props }) => {
  const history = useHistory();
  const userStatus = useUserStatus();
  const { t, i18n } = useTranslation();
  const [mapImage, setMapImage] = useState(null);

  const {
    id,
    price,
    floor_area,
    levels,
    bedrooms,
    floor,
    kitchens,
    bathrooms,
    wc,
    living_rooms,
    heating_system,
    energy_class,
    construction_year,
    availability,
    listingPage,
    images,
    longitude,
    latitude,
    amenities,
    view,
    orientation,
    length_of_facade,
    distance_from_sea,
    cover_coefficient,
    building_coefficient,
    zone,
    slope,
    service_charge,
    currency,
    land_area,
    rooms,
    power_type,
    floor_type,
    opening_frames,
  } = props;


  useEffect(() => {
    if (nonEssentialConsent && latitude !== undefined && longitude !== undefined) {
      setMapReady(true);
    }
  }, [nonEssentialConsent, latitude, longitude]);

  const lng = i18n.language;

  const description = lng === "el" ? props.description_gr : props.description;

  const amenitiesArray = [];

  amenities?.map((amenity) => amenitiesArray.push(amenity.name));

  const amenitiesList = amenitiesArray.map((amenity, id) => (
    <div key={id} className={`${styles.Amenity}`}>
      <span>{t(`amenities.${amenity}`)} </span>
      <i className={`fa-solid fa-square-check ${styles.AmenityChecked}`}></i>
    </div>
  ));

  const [mapReady, setMapReady] = useState(false);

  // Format price value with commas
  let priceValue = "";
  if (typeof price === 'number' && !isNaN(price)) {
    priceValue = price.toLocaleString("de-DE");
  }

  const energy_classValue = energy_class === "to_be_issued" ? t("propertyDetails.energyClassTypes.toBeIssued") : energy_class;

  const land_areaValue = land_area === "" || land_area === null || land_area === 0 ? "N/A" : `${land_area} m²`;

  const floorValue =
    floor < 0
      ? t("propertyDetails.floorValue.basement")
      : floor === 0
        ? t("propertyDetails.floorValue.ground")
        : floor === 1
          ? `${floor}${t("propertyDetails.floorValue.first")}`
          : floor === 2
            ? `${floor}${t("propertyDetails.floorValue.second")} `
            : floor === 3
              ? `${floor}${t("propertyDetails.floorValue.third")}`
              : floor === null ?
                t("propertyDetails.floorValue.na")
                : `${floor}${t("propertyDetails.floorValue.th")}`;

  const residentialTableData = (
    <Table className={`${styles.Listing__table} shadow`}>
      <tbody>
        {[
          { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
          { label: t("propertyDetails.floorArea"), value: `${floor_area} m²` },
          { label: t("propertyDetails.landArea"), value: land_areaValue },
          { label: t("propertyDetails.floorLevel"), value: props.type === "residential" && props.sub_type !== "maisonette" ? floorValue : t("propertyDetails.floorValue.ground") },
          { label: t("propertyDetails.bedrooms"), value: bedrooms },
          { label: t("propertyDetails.kitchens"), value: kitchens },
          { label: t("propertyDetails.bathrooms"), value: bathrooms },
          { label: t("propertyDetails.wc"), value: wc },
          { label: t("propertyDetails.livingRooms"), value: living_rooms },
          { label: t("propertyDetails.levels"), value: levels },
          { label: t("propertyDetails.heating_system.title"), value: t(`propertyDetails.heating_system.${heating_system}`) },
          { label: t("propertyDetails.energyClass"), value: energy_classValue },
          { label: t("propertyDetails.floorTypes.title"), value: t(`propertyDetails.floorTypes.${floor_type}`) },
          { label: t("propertyDetails.openingFrames.title"), value: t(`propertyDetails.openingFrames.${opening_frames}`) },
          { label: t("propertyDetails.yearBuilt"), value: construction_year },
          { label: t("propertyDetails.serviceCharge"), value: `${currency} ${service_charge}` },
          { label: t("propertyDetails.availability"), value: availability },
        ].map((feature, index) => (
          <tr key={index}>
            <td className={styles.tdWidth}>{feature.label}</td>
            <td>{feature.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const landTableData = (
    <Table className={`${styles.Listing__table} shadow`}>
      <tbody>
        {[
          { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
          { label: t("propertyDetails.landArea"), value: `${land_area} m²` },
          { label: t("propertyDetails.cover_coefficient"), value: `${cover_coefficient} %` },
          { label: t("propertyDetails.building_coefficient"), value: `${building_coefficient} %` },
          { label: t("propertyDetails.lengthOfFacade"), value: `${length_of_facade} m` },
          { label: t("propertyDetails.orientationTypes.title"), value: t(`propertyDetails.orientationTypes.${orientation}`) },
          { label: t("propertyDetails.viewTypes.title"), value: t(`propertyDetails.viewTypes.${view}`) },
          { label: t("propertyDetails.zoneTypes.title"), value: t(`propertyDetails.zoneTypes.${zone}`) },
          { label: t("propertyDetails.slopeTypes.title"), value: t(`propertyDetails.slopeTypes.${slope}`) },
          { label: t("propertyDetails.distanceFromSea"), value: `${distance_from_sea} m` },
          { label: t("propertyDetails.availability"), value: availability },
        ].map((feature, index) => (
          <tr key={index}>
            <td className={styles.tdWidth}>{feature.label}</td>
            <td>{feature.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const commercialTableData = (
    <Table className={`${styles.Listing__table} shadow`}>
      <tbody>
        {[
          { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
          { label: t("propertyDetails.floorArea"), value: `${floor_area} m²` },
          { label: t("propertyDetails.landArea"), value: `${land_area}  m²` },
          { label: t("propertyDetails.floorLevel"), value: floorValue },
          { label: t("propertyDetails.levels"), value: levels },
          { label: t("propertyDetails.rooms"), value: rooms },
          { label: t("propertyDetails.bathrooms"), value: bathrooms },
          { label: t("propertyDetails.wc"), value: wc },
          { label: t("propertyDetails.heating_system.title"), value: t(`propertyDetails.heating_system.${heating_system}`) },
          { label: t("propertyDetails.energyClass"), value: energy_classValue },
          { label: t("propertyDetails.powerType.title"), value: t(`propertyDetails.powerType.${power_type}`) },
          { label: t("propertyDetails.floorTypes.title"), value: t(`propertyDetails.floorTypes.${floor_type}`) },
          { label: t("propertyDetails.yearBuilt"), value: construction_year },
          { label: t("propertyDetails.serviceCharge"), value: `${currency} ${service_charge}` },
          { label: t("propertyDetails.availability"), value: availability },
        ].map((feature, index) => (
          <tr key={index}>
            <td className={styles.tdWidth}>{feature.label}</td>
            <td>{feature.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

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

  return (
    <>
      <Helmet>
        <title>{`Listing_AE000${props.id}`}</title>
        <meta name="keywords" content={`${props.sale_type}, ${props.type}, ${props.sub_type}, ${props.municipality}, ${props.county}, ${props.region}, Features, amenities, real estate, Acropolis Estates, price, bedroom, apartment, name, floor, area, heating, email, acropolis, estates, london,  `} />
      </Helmet>
      <Container className="mt-5 pt-2">

        <ListingImages images={images} listing_id={id} amenities={amenities} />

        <Row className="justify-content-start">

          <Col>
            <div className={styles.Listing__cardBodyListing}>
              <ListingHeader {...props} listingPage={listingPage} />
            </div>
            <div className="my-4">
              <h5>{lng === "el" ? t("propertyDetails.description_gr") : t("propertyDetails.description")}</h5>
              <p>{description}</p>
            </div>

          </Col>


          <h5>{t("propertiesPage.header1")}</h5>
          <Col lg={8}>

            {props.type === "residential" && residentialTableData}
            {props.type === "commercial" && commercialTableData}
            {props.type === "land" && landTableData}

            <Col className="my-5">
              <h5 className="ps-2 pb-1">{t("propertiesPage.header2")}</h5>
              <div className={`${styles.AmenitiesBox}`}>{amenitiesList}</div>
            </Col>
            <Col className="mx-auto my-5">{mapReady && <MapMarker {...props} setShowCookieBanner={setShowCookieBanner} nonEssentialConsent={nonEssentialConsent} setMapImage={setMapImage} />}</Col>
            <Col className="my-5">
              {mapImage && (
                <img src={mapImage} alt="Captured Map" style={{ width: "100%", height: "auto", marginTop: "10px" }} />
              )}
              <MortgagePaymentCalculator price={props?.price} />
              {userStatus && <div className="mb-4">
                <Brochure {...props} mapImage={mapImage} amenitiesList={amenitiesList} />
              </div>}
              {userStatus && <StaffCard {...props} handleDelete={handleDelete} handleEdit={handleEdit} />}
            </Col>

          </Col>

          <Col lg={4} className="mb-3">
            <ContactForm listing_id={id} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Listing;
