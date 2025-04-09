import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../assets/logo.png";
import styles from "../styles/Brochure.module.css";
import listingStyles from "../styles/Listing.module.css";
import btnStyles from "../styles/Button.module.css";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useFetchLocationData from "hooks/useFetchLocationData";


const Brochure = ({ mapImage, amenitiesList, ...props }) => {
    const pdfRef = useRef();

    const listing = props;

    const {
        id,
        type,
        floor_area,
        levels,
        bedrooms,
        kitchens,
        bathrooms,
        wc,
        living_rooms,
        heating_system,
        energy_class,
        construction_year,
        view,
        orientation,
        length_of_facade,
        distance_from_sea,
        cover_coefficient,
        building_coefficient,
        zone,
        slope,
        currency,
        land_area,
        rooms,
        power_type,
        floor_type,
        opening_frames,
    } = props;

    const getMapImageUrl = (latitude, longitude) => {
        const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=600x350&maptype=roadmap&markers=color:brown%7Clabel:A%7C${latitude},${longitude}&key=${API_KEY}`;
    };


    const mapImageUrl = getMapImageUrl(listing?.latitude, listing?.longitude);

    const [typeReady, setTypeReady] = useState(false);

    const { t, i18n } = useTranslation();

    const lng = i18n.language;

    const description = lng === "el" ? props.description_gr : props.description;

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
                    ? <span>{props.floor}<sup>{t("propertyDetails.floorValue.first")}</sup></span>
                    : props.floor === 2
                        ? <span>{props.floor}<sup>{t("propertyDetails.floorValue.second")}</sup></span>
                        : props.floor === 3
                            ? <span>{props.floor}<sup>{t("propertyDetails.floorValue.third")}</sup></span>
                            : props.floor === null
                                ? <span>{t("propertyDetails.floorValue.na")}</span>
                                : <span>{props.floor}<sup>{t("propertyDetails.floorValue.th")}</sup></span>;

    const not_land = <div className={`${listingStyles.Listing__fontawsome} d-flex `}>
        <p>
            <i className="fa-solid fa-bed me-3"> {props.bedrooms}</i>
        </p>
        <p>
            <i className="fa-solid fa-bath me-3"> {props.bathrooms}</i>
        </p>
        <p className={listingStyles.Listing__levels}>
            {props.sub_type === "maisonette" ? <i className="fa-solid fa-bars"> {props.levels}</i> : <i className="fa-solid fa-stairs"> <span className={`${lng === "el" ? `${styles.Listing__floorValue}` : `${styles.Listing__floorValueEn}`}`}>{floorValue}</span></i>}
        </p>
    </div>

    const land = <div className={`${listingStyles.Listing__fontawsome} d-flex `}>
        <p>
            <i className="fa-solid fa-ruler-combined"><span className="ps-1">{props.type === "commercial" ? props.floor_area : props.land_area}</span></i>
            m²
        </p>
    </div>

    const commercial = <div className={`${listingStyles.Listing__fontawsome} d-flex `}>
        <p>
            <i className="fa-solid fa-ruler-combined"><span className="ps-1">{props.type === "commercial" ? props.floor_area : props.land_area}</span></i>
            m²
        </p>
    </div>


    const energy_classValue = energy_class === "to_be_issued" ? t("propertyDetails.energyClassTypes.toBeIssued") : energy_class;

    const land_areaValue = land_area === "" || land_area === null || land_area === 0 ? "N/A" : `${land_area} m²`;


    const residentialTableData = (
        <table className={`${styles.Listing__table} shadow`}>
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
                ].map((feature, index) => (
                    <tr key={index}>
                        <td className={styles.tdWidth}>{feature.label}</td>
                        <td>{feature.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const landTableData = (
        <table className={`${styles.Listing__table} shadow`}>
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
                ].map((feature, index) => (
                    <tr key={index}>
                        <td className={styles.tdWidth}>{feature.label}</td>
                        <td>{feature.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const commercialTableData = (
        <table className={`${styles.Listing__table} shadow`}>
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
                    { label: t("propertyDetails.yearBuilt"), value: construction_year },
                ].map((feature, index) => (
                    <tr key={index}>
                        <td className={styles.tdWidth}>{feature.label}</td>
                        <td>{feature.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const generatePDF = () => {
        const input = pdfRef.current;
        setTimeout(() => {
            html2canvas(input, {
                useCORS: true, allowTaint: true,
                scale: 3
            }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("l", "mm", "a4"); // Landscape mode
                const imgWidth = 297; // A4 width in mm for landscape
                const pageHeight = 210; // A4 height in mm for landscape
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                if (imgHeight <= pageHeight) {
                    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                } else {
                    let heightLeft = imgHeight;
                    let position = 0;

                    while (heightLeft > 0) {
                        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                        if (heightLeft > 0) {
                            pdf.addPage();
                            position -= pageHeight;
                        }
                    }
                }
                pdf.save(`listing_AE000${listing?.id}.pdf`);
            });
        }, 2000);
    };

    return (
        <>
            <div ref={pdfRef} className={styles.BrochureContainer} style={{ width: "297mm" }}>
                {/* position: "absolute", top: "-10000px", left: "-10000px", */}
                <div style={{ width: "297mm", background: "transparent" }} className="d-flex flex-column">
                    <div style={{ height: "210mm", width: "297mm", background: "transparent" }} className={`m-0 p-0 ${styles.ContainerWrapper}`}>
                        <div className={`d-flex flex-column m-0 p-0 justify-content-between `}>
                            <div className={`${styles.BrochureLogo} d-flex ps-4`}>
                                <img src={logo} alt="logo" style={{ width: "200px", height: "100px" }} className="me-auto m-1" />
                            </div>
                            <div className="d-flex justify-content-around">
                                <div className="col-6 ps-3 pe-1">
                                    <div
                                        className={styles.Image}
                                        style={{ backgroundImage: `url(${listing?.images[0]?.url})` }}>
                                    </div>
                                </div>
                                <div className="col-6 pe-3 d-flex flex-column mt-auto">
                                    <div className="">
                                        <div
                                            className={styles.ImageWrapper}
                                            style={{ backgroundImage: `url(${listing?.images[2]?.url})` }}>
                                        </div>
                                    </div>
                                    <div className="">
                                        <div
                                            className={styles.ImageWrapper}
                                            style={{ backgroundImage: `url(${listing?.images[1]?.url})` }}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`d-flex align-items-center mt-auto ${styles.OliveBg} ${styles.FooterPosition}`} style={{ width: "297.5mm" }}>
                                <div className="col-8 ps-2">
                                    <div className={`${styles.TextSize}`}>
                                        <div>
                                            {t("propertyDetails.title", {
                                                sale_type: saleType,
                                                type: type === "land" ? translatedType : translatedSubType,
                                            })},   {`${municipalityName?.municipality}, ${props.postcode}`}
                                        </div>
                                        <p className="h5">ID: AE000{id}, {t("propertyDetails.price")}: {currency} {priceValue}</p>
                                    </div>
                                </div>
                                <div className={`col-4 ms-auto me-5 ${styles.TextSize} `}>
                                    {type === "land" ? land : type === "residential" ? not_land : commercial}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECOND PAGE */}
                    <div style={{ height: "210mm", width: "297mm", background: "transparent" }} className={`d-flex flex-column align-items-center justify-content-between m-0 p-0 ${styles.ContainerWrapper}`}>
                        <div className="col-12 p-4">
                            <div className={`${styles.BrochureDescription}`}>
                                <p className="h2">{lng === "el" ? t("propertyDetails.description_gr") : t("propertyDetails.description")}</p>
                                <p>{description}</p>
                            </div>
                        </div>
                        <div className="d-flex col-12 justify-content-around mb-auto">
                            <div className="col-4 ps-5">
                                {type === "residential" && residentialTableData}
                                {type === "commercial" && commercialTableData}
                                {type === "land" && landTableData}
                            </div>
                            <div className="col-7">
                                <img
                                    loading="lazy"
                                    src={mapImageUrl}
                                    alt={listing?.images[0]?.id}
                                    className={styles.ImageMap}
                                />
                            </div>
                        </div>
                        <div className={`d-flex w-100 justify-content-between mt-auto px-2 ${styles.Footer} ${styles.OliveBg} ${styles.FooterPosition}`} style={{ width: "297.5mm" }}>
                            <div className="col-5 pe-0">
                                <p className="m-0 border-end border-dark me-3"> 
                                    {t("footer.contact.address")} {t("footer.contact.city")}
                                </p>
                            </div>
                            <div className="col-4">
                                <p className="my-0 border-end border-dark me-5 ps-4">
                                    <Trans i18nKey="footer.contact.email" components={{
                                        1: <Link to="/contact" className={`${styles.link}`} />
                                    }} />
                                </p>
                            </div>
                            <div className="col-3">
                                <p className="m-0 w-100">
                                    {t("footer.contact.phone")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <button onClick={generatePDF} className={`${btnStyles.Button} ${btnStyles.AngryOceanOutline}`}>Download Brochure</button>
        </>
    );
};

export default Brochure;