import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { axiosRes } from "../../api/axiosDefaults";
import { useTranslation } from "react-i18next";
import useUserStatus from "../../hooks/useUserStatus";

import ListingImages from "./ListingImages";
import ListingHeader from "./ListingHeader";
import ContactForm from "../../pages/contact/ContactForm";
import MapMarker from "../MapMarker";
import { StaffCard } from "./StaffCard";
import MortgagePaymentCalculator from "../MortgagePaymentCalculator";
import Brochure from "components/Brochure";
import { formatPriceValue, getFloorValue } from "utils/formatting";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import styles from "../../styles/Listing.module.css";

const Listing = ({ setShowCookieBanner, nonEssentialConsent, ...props }) => {
  const history = useHistory();
  const userStatus = useUserStatus();
  const { t, i18n } = useTranslation();

  const [mapReady, setMapReady] = useState(false);
  const [mapImage, setMapImage] = useState(null);
  const lng = i18n.language;

  const {
    id, price, floor_area, levels, bedrooms, floor, kitchens, bathrooms, wc,
    living_rooms, heating_system, energy_class, construction_year, availability,
    listingPage, images, longitude, latitude, amenities, view, orientation,
    length_of_facade, distance_from_sea, cover_coefficient, building_coefficient,
    zone, slope, service_charge, currency, land_area, rooms, power_type,
    floor_type, opening_frames, sale_type, type, sub_type, municipality, county, region,
    description_gr, description
  } = props;

  useEffect(() => {
    if (nonEssentialConsent && latitude !== undefined && longitude !== undefined) {
      setMapReady(true);
    }
  }, [nonEssentialConsent, latitude, longitude]);

  const parsedDescription = lng === "el" ? description_gr : description;

  const amenitiesList = useMemo(() => (
    amenities?.map((amenity, id) => (
      <div key={id} className={styles.Amenity}>
        <span>{t(`amenities.${amenity.name}`)}</span>
        <i className={`fa-solid fa-square-check ${styles.AmenityChecked}`}></i>
      </div>
    )) || []
  ), [amenities, t]);

  const priceValue = formatPriceValue(price);
  const energyClassLabel = energy_class === "to_be_issued"
    ? t("propertyDetails.energyClassTypes.toBeIssued")
    : energy_class;
  const landAreaLabel = !land_area ? "N/A" : `${land_area} m²`;
  const floorLabel = getFloorValue(floor, t);

  const tableRow = (label, value, idx) => (
    <tr key={idx}>
      <td className={styles.tdWidth}>{label}</td>
      <td>{value}</td>
    </tr>
  );

  const propertyTables = {
    residential: [
      [t("propertyDetails.price"), `${currency} ${priceValue}`],
      [t("propertyDetails.floorArea"), `${floor_area} m²`],
      [t("propertyDetails.landArea"), landAreaLabel],
      [t("propertyDetails.floorLevel"), type === "residential" && sub_type !== "maisonette" ? floorLabel : t("propertyDetails.floorValue.ground")],
      [t("propertyDetails.bedrooms"), bedrooms],
      [t("propertyDetails.kitchens"), kitchens],
      [t("propertyDetails.bathrooms"), bathrooms],
      [t("propertyDetails.wc"), wc],
      [t("propertyDetails.livingRooms"), living_rooms],
      [t("propertyDetails.levels"), levels],
      [t("propertyDetails.heating_system.title"), t(`propertyDetails.heating_system.${heating_system}`)],
      [t("propertyDetails.energyClass"), energyClassLabel],
      [t("propertyDetails.floorTypes.title"), t(`propertyDetails.floorTypes.${floor_type}`)],
      [t("propertyDetails.openingFrames.title"), t(`propertyDetails.openingFrames.${opening_frames}`)],
      [t("propertyDetails.yearBuilt"), construction_year],
      [t("propertyDetails.serviceCharge"), `${currency} ${service_charge}`],
      [t("propertyDetails.availability"), availability],
    ],
    land: [
      [t("propertyDetails.price"), `${currency} ${priceValue}`],
      [t("propertyDetails.landArea"), `${land_area} m²`],
      [t("propertyDetails.cover_coefficient"), `${cover_coefficient} %`],
      [t("propertyDetails.building_coefficient"), `${building_coefficient} %`],
      [t("propertyDetails.lengthOfFacade"), `${length_of_facade} m`],
      [t("propertyDetails.orientationTypes.title"), t(`propertyDetails.orientationTypes.${orientation}`)],
      [t("propertyDetails.viewTypes.title"), t(`propertyDetails.viewTypes.${view}`)],
      [t("propertyDetails.zoneTypes.title"), t(`propertyDetails.zoneTypes.${zone}`)],
      [t("propertyDetails.slopeTypes.title"), t(`propertyDetails.slopeTypes.${slope}`)],
      [t("propertyDetails.distanceFromSea"), `${distance_from_sea} m`],
      [t("propertyDetails.availability"), availability],
    ],
    commercial: [
      [t("propertyDetails.price"), `${currency} ${priceValue}`],
      [t("propertyDetails.floorArea"), `${floor_area} m²`],
      [t("propertyDetails.landArea"), `${land_area} m²`],
      [t("propertyDetails.floorLevel"), floorLabel],
      [t("propertyDetails.levels"), levels],
      [t("propertyDetails.rooms"), rooms],
      [t("propertyDetails.bathrooms"), bathrooms],
      [t("propertyDetails.wc"), wc],
      [t("propertyDetails.heating_system.title"), t(`propertyDetails.heating_system.${heating_system}`)],
      [t("propertyDetails.energyClass"), energyClassLabel],
      [t("propertyDetails.powerType.title"), t(`propertyDetails.powerType.${power_type}`)],
      [t("propertyDetails.floorTypes.title"), t(`propertyDetails.floorTypes.${floor_type}`)],
      [t("propertyDetails.yearBuilt"), construction_year],
      [t("propertyDetails.serviceCharge"), `${currency} ${service_charge}`],
      [t("propertyDetails.availability"), availability],
    ]
  };

  const renderTable = (type) => (
    <Table className={`${styles.Listing__table} shadow`}>
      <tbody>
        {propertyTables[type]?.map(([label, value], idx) => tableRow(label, value, idx))}
      </tbody>
    </Table>
  );

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/listings/${id}/`);
      history.push("/listings");
    } catch (err) {
      // console.log(err);
    }
  };

  const handleEdit = () => {
    history.push(`/frontend/admin/listings/${id}/edit`);
  };

  return (
    <>
      <Helmet>
        <title>{`Listing_AE000${id}`}</title>
        <meta
          name="keywords"
          content={`${sale_type}, ${type}, ${sub_type}, ${municipality}, ${county}, ${region}, Features, amenities, real estate, Acropolis Estates, price, bedroom, apartment, name, floor, area, heating, email, acropolis, estates, london`}
        />
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
              <p>{parsedDescription}</p>
            </div>
          </Col>

          <h5>{t("propertiesPage.header1")}</h5>

          <Col lg={8}>
            {renderTable(type)}

            <Col className="my-5">
              <h5 className="ps-2 pb-1">{t("propertiesPage.header2")}</h5>
              <div className={styles.AmenitiesBox}>{amenitiesList}</div>
            </Col>

            <Col className="mx-auto my-5">
              {mapReady && (
                <MapMarker
                  {...props}
                  setShowCookieBanner={setShowCookieBanner}
                  nonEssentialConsent={nonEssentialConsent}
                  setMapImage={setMapImage}
                />
              )}

              {mapImage && (
                <img
                  src={mapImage}
                  alt="Captured Map"
                  style={{ width: "100%", height: "auto", marginTop: "10px" }}
                />
              )}

              <MortgagePaymentCalculator price={price} />

              {userStatus && (
                <>
                  <div className="mb-4">
                    <Brochure {...props} mapImage={mapImage} amenitiesList={amenitiesList} />
                  </div>
                  <StaffCard {...props} handleDelete={handleDelete} handleEdit={handleEdit} />
                </>
              )}
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