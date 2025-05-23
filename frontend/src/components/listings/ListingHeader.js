import React, { useEffect, useState } from "react";

import styles from "../../styles/Listing.module.css";
import { useTranslation } from "react-i18next";
import useFetchLocationData from "../../hooks/useFetchLocationData";

const ListingHeader = React.memo((props) => {
  const [typeReady, setTypeReady] = useState(false);

  const { t, i18n } = useTranslation();

  const lng = i18n.language;

  const { regionsData } = useFetchLocationData();

  const region_id = regionsData?.find(region => region.id === props.region_id);
  const county_id = region_id?.counties.find(county => county.id === props.county_id);
  const municipality_id = county_id?.municipalities.find(municipality => municipality.id === props.municipality_id);

  const municipalityName = { municipality: lng === "el" ? municipality_id?.greekName : municipality_id?.englishName };

  useEffect(() => {
    if (props.type !== undefined && props.sub_type !== undefined) {
      setTypeReady(true);
    }
  }, [i18n, lng, props.type, props.sub_type]);

  const saleType = typeReady && props.sale_type === "rent" ? `${t("propertyDetails.typeRent")}` : `${t("propertyDetails.typeSale")}`;

  const translatedType = typeReady && t(`propertyDetails.types.${props.type}`);

  const translatedSubType = typeReady && t(`propertyDetails.subTypes.${props.sub_type}`);
  const municipality = lng === "el" ? props.municipality_gr : props.municipality;
  const county = lng === "el" ? props.county_gr : props.county;

  let priceValue = "";
  if (typeof props.price === 'number' && !isNaN(props.price)) {
    priceValue = props.price.toLocaleString("de-DE");
  }

  const floorValue =
    props.floor < 0
      ? <span>{t("propertyDetails.floorValue.basement")}</span>
      : props.floor === 0
        ? <span>{t("propertyDetails.floorValue.ground")}</span>
        : props.floor === 1
          ? <span><sup>{t("propertyDetails.floorValue.first")}</sup></span>
          : props.floor === 2
            ? <span><sup>{t("propertyDetails.floorValue.second")}</sup></span>
            : props.floor === 3
              ? <span><sup>{t("propertyDetails.floorValue.third")}</sup></span>
              : props.floor === null
                ? <span>{t("propertyDetails.floorValue.na")}</span>
                : <span><sup>{t("propertyDetails.floorValue.th")}</sup></span>;

  const residential = <div className={styles.Listing__fontawsome}>
    <p>
      <i className="fa-solid fa-bed"> {props.bedrooms}</i>
    </p>
    <p>
      <i className="fa-solid fa-bath"> {props.bathrooms}</i>
    </p>
    <p className={styles.Listing__levels}>
      {props.sub_type === "maisonette" ? <i className="fa-solid fa-layer-group"> {props.levels}</i> : <i className="fa-solid fa-stairs">{props.floor === 0 ? "" : props.floor}<span className={`${lng === "el" ? `${styles.Listing__floorValue}` : `${styles.Listing__floorValueEn}`}`}>{floorValue}</span></i>}
    </p>
  </div>

  const landCommercial = <div className={styles.Listing__fontawsome}>
    <p>
      <i className="fa-solid fa-ruler-combined"><span className="ps-1">{props.type === "commercial" ? props.floor_area : props.land_area}</span></i>
      m²
    </p>
  </div>

  return (
    <div className={styles.Listing__cardBody}>
      <div className={styles.Listing__header}>
        <div className={styles.Listing__headerListingDetails}>
          {t("propertyDetails.title", {

            sale_type: saleType,
            type: props.type === "land" ? translatedType : translatedSubType,
          })},   {props.municipality_id ? `${municipalityName?.municipality}, ${props.postcode}` : `${municipality}, ${county}, ${props.postcode}`}
        </div>
        {props.type === "residential" ? residential : landCommercial}
        <div className="m-0">
          <h6 className={styles.Listing__price}>{t("propertyDetails.price")}: {props.currency} {priceValue}</h6>
          <h6 className={styles.Listing__price}>ID: AE000{props.id}</h6>
        </div>
      </div>
    </div>
  );
});

export default ListingHeader;
