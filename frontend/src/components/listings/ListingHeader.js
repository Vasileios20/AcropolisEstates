import React, { useEffect, useState, useMemo } from "react";
import styles from "../../styles/Listing.module.css";
import { useTranslation } from "react-i18next";
import useFetchLocationData from "../../hooks/useFetchLocationData";
import { useRouteFlags } from "contexts/RouteProvider";
import { formatPriceValue, getFloorValue } from "utils/formatting";

const ListingHeader = React.memo((props) => {
  const { shortTermListing } = useRouteFlags();
  const { t, i18n } = useTranslation();
  const { regionsData } = useFetchLocationData();
  const lng = i18n.language;

  const [typeReady, setTypeReady] = useState(false);

  useEffect(() => {
    if (props.type !== undefined && props.sub_type !== undefined) {
      setTypeReady(true);
    }
  }, [props.type, props.sub_type]);

  // ----- Region / County / Municipality -----
  const region = useMemo(() => regionsData?.find(r => r.id === props.region_id), [regionsData, props.region_id]);
  const county = useMemo(() => region?.counties.find(c => c.id === props.county_id), [region, props.county_id]);
  const municipality = useMemo(() => county?.municipalities.find(m => m.id === props.municipality_id), [county, props.municipality_id]);

  const municipalityName = useMemo(() => {
    return {
      municipality: lng === "el" ? municipality?.greekName : municipality?.englishName
    };
  }, [municipality, lng]);

  // ----- Type / Subtype / Sale -----
  const saleType = useMemo(() => {
    return typeReady && props.sale_type === "rent" ? t("propertyDetails.typeRent") : t("propertyDetails.typeSale");
  }, [typeReady, props.sale_type, t]);

  const translatedType = useMemo(() => {
    return typeReady && t(`propertyDetails.types.${props.type}`);
  }, [typeReady, props.type, t]);

  const translatedSubType = useMemo(() => {
    return typeReady && t(`propertyDetails.subTypes.${props.sub_type}`);
  }, [typeReady, props.sub_type, t]);

  // ----- Fallback location text if no IDs provided -----
  const fallbackMunicipality = lng === "el" ? props.municipality_gr : props.municipality;
  const fallbackCounty = lng === "el" ? props.county_gr : props.county;

  // ----- Price / Floor -----
  const priceValue = formatPriceValue(props.price);
  const floorValue = getFloorValue(props.floor, t);

  // ----- Residential Icons -----
  const residential = (
    <div className={styles.Listing__fontawsome}>
      <p><i className="fa-solid fa-bed"> {props.bedrooms}</i></p>
      <p><i className="fa-solid fa-bath"> {props.bathrooms}</i></p>
      <p className={styles.Listing__levels}>
        {props.sub_type === "maisonette" ? (
          <i className="fa-solid fa-layer-group"> {props.levels}</i>
        ) : (
          <i className="fa-solid fa-stairs">
            <span className={lng === "el" ? styles.Listing__floorValue : styles.Listing__floorValueEn}>
              {floorValue}
            </span>
          </i>
        )}
      </p>
    </div>
  );

  // ----- Land/Commercial Icon -----
  const landCommercial = (
    <div className={styles.Listing__fontawsome}>
      <p>
        <i className="fa-solid fa-ruler-combined">
          <span className="ps-1">
            {props.type === "commercial" ? props.floor_area : props.land_area}
          </span>
        </i>
        m²
      </p>
    </div>
  );

  // ----- Listing View -----
  const renderListing = () => (
    <div className={styles.Listing__cardBody}>
      <div className={styles.Listing__header}>
        <div className={styles.Listing__headerListingDetails}>
          {t("propertyDetails.title", {
            sale_type: saleType,
            type: props.type === "land" ? translatedType : translatedSubType,
          })}
          ,{" "}
          {props.municipality_id
            ? `${municipalityName?.municipality}, ${props.postcode}`
            : `${fallbackMunicipality}, ${fallbackCounty}, ${props.postcode}`}
        </div>

        {props.type === "residential" ? residential : landCommercial}

        <div className="m-0">
          <h6 className={styles.Listing__price}>
            {t("propertyDetails.price")}: {props?.currency} {priceValue}
          </h6>
          <h6 className={styles.Listing__price}>ID: AE000{props.id}</h6>
        </div>
      </div>
    </div>
  );

  // ----- Short-term View -----
  const renderShortTermListing = () => (
    <div className={styles.Listing__cardBody}>
      <div className={styles.Listing__header}>
        <div className="m-0">
          <h6 className={styles.Listing__price}>{lng === "el" ? props.title_gr : props.title}</h6>
        </div>
        {residential}
        <div className={styles.Listing__headerListingDetails}>
          {props.municipality_id
            ? `${municipalityName?.municipality}, ${props.postcode}`
            : `${fallbackMunicipality}, ${fallbackCounty}`}
        </div>

      </div>
    </div>
  );

  return <div>{shortTermListing ? renderShortTermListing() : renderListing()}</div>;
});

export default ListingHeader;