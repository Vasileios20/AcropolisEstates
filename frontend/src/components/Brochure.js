import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Spin, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import logo from "../assets/logo.png";
import styles from "../styles/Brochure.module.css";
import listingStyles from "../styles/Listing.module.css";
import btnStyles from "../styles/Button.module.css";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useFetchLocationData from "hooks/useFetchLocationData";

const Brochure = ({ mapImage, amenitiesList, showDownloadButton = true, ...props }) => {
    const pdfRef = useRef();
    const listing = props;
    const [isGenerating, setIsGenerating] = useState(false);
    const [typeReady, setTypeReady] = useState(false);
    const { t, i18n } = useTranslation();
    const lng = i18n.language;

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
        images,
    } = props;

    const description = lng === "el" ? props.description_gr : props.description;
    const { regionsData } = useFetchLocationData();

    // Safe image access with fallback
    const getImage = (index) => {
        return images?.[index]?.url || null;
    };

    const primaryImage = getImage(0);
    const secondaryImage1 = getImage(1);
    const secondaryImage2 = getImage(2);

    // Location data
    const region_id = regionsData?.find(region => region.id === props.region_id);
    const county_id = region_id?.counties.find(county => county.id === props.county_id);
    const municipality_id = county_id?.municipalities.find(municipality => municipality.id === props.municipality_id);
    const municipalityName = lng === "el" ? municipality_id?.greekName : municipality_id?.englishName;

    // Map URL
    const getMapImageUrl = (latitude, longitude) => {
        const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (!latitude || !longitude || !API_KEY) return null;
        return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=600x350&maptype=roadmap&markers=color:brown%7Clabel:A%7C${latitude},${longitude}&key=${API_KEY}`;
    };

    const mapImageUrl = getMapImageUrl(listing?.latitude, listing?.longitude);

    useEffect(() => {
        if (props.type !== undefined && props.sub_type !== undefined) {
            setTypeReady(true);
        }
    }, [i18n, lng, props.type, props.sub_type]);

    // Translations
    const saleType = typeReady && props.sale_type === "rent"
        ? t("propertyDetails.typeRent")
        : t("propertyDetails.typeSale");

    const translatedType = typeReady && t(`propertyDetails.types.${props.type}`);
    const translatedSubType = typeReady && t(`propertyDetails.subTypes.${props.sub_type}`);

    // Price formatting
    let priceValue = "";
    if (typeof props.price === 'number' && !isNaN(props.price)) {
        priceValue = props.price.toLocaleString("de-DE");
    }

    // Floor value
    const getFloorValue = () => {
        if (props.floor < 0) return t("propertyDetails.floorValue.basement");
        if (props.floor === 0) return t("propertyDetails.floorValue.ground");
        if (props.floor === null) return t("propertyDetails.floorValue.na");

        const suffixes = {
            1: "first",
            2: "second",
            3: "third",
        };

        const suffix = suffixes[props.floor] || "th";
        return (
            <span>
                {props.floor}<sup>{t(`propertyDetails.floorValue.${suffix}`)}</sup>
            </span>
        );
    };

    const floorValue = getFloorValue();

    // Energy class
    const energy_classValue = energy_class === "to_be_issued"
        ? t("propertyDetails.energyClassTypes.toBeIssued")
        : energy_class;

    const land_areaValue = land_area === "" || land_area === null || land_area === 0
        ? "N/A"
        : `${land_area} m²`;

    // Icon displays for different property types
    const PropertyIcons = () => {
        if (type === "land") {
            return (
                <div className={`${listingStyles.Listing__fontawsome} d-flex`}>
                    <p>
                        <i className="fa-solid fa-ruler-combined">
                            <span className="ps-1">{land_area}</span>
                        </i> m²
                    </p>
                </div>
            );
        }

        if (type === "commercial") {
            return (
                <div className={`${listingStyles.Listing__fontawsome} d-flex`}>
                    <p>
                        <i className="fa-solid fa-ruler-combined">
                            <span className="ps-1">{floor_area}</span>
                        </i> m²
                    </p>
                </div>
            );
        }

        // Residential
        return (
            <div className={`${listingStyles.Listing__fontawsome} d-flex`}>
                <p>
                    <i className="fa-solid fa-bed me-3"> {bedrooms}</i>
                </p>
                <p>
                    <i className="fa-solid fa-bath me-3"> {bathrooms}</i>
                </p>
                <p className={listingStyles.Listing__levels}>
                    {props.sub_type === "maisonette" ? (
                        <i className="fa-solid fa-bars"> {levels}</i>
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
    };

    // Table data generators
    const createTableRow = (features) => (
        <table className={`${styles.Listing__table} shadow`}>
            <tbody>
                {features.filter(f => f.value !== null && f.value !== undefined && f.value !== "").map((feature, index) => (
                    <tr key={index}>
                        <td className={styles.tdWidth}>{feature.label}</td>
                        <td>{feature.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const residentialTableData = createTableRow([
        { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
        { label: t("propertyDetails.floorArea"), value: floor_area ? `${floor_area} m²` : null },
        { label: t("propertyDetails.landArea"), value: land_areaValue },
        { label: t("propertyDetails.floorLevel"), value: type === "residential" && props.sub_type !== "maisonette" ? floorValue : t("propertyDetails.floorValue.ground") },
        { label: t("propertyDetails.bedrooms"), value: bedrooms },
        { label: t("propertyDetails.kitchens"), value: kitchens },
        { label: t("propertyDetails.bathrooms"), value: bathrooms },
        { label: t("propertyDetails.wc"), value: wc },
        { label: t("propertyDetails.livingRooms"), value: living_rooms },
        { label: t("propertyDetails.levels"), value: levels },
        { label: t("propertyDetails.heating_system.title"), value: heating_system ? t(`propertyDetails.heating_system.${heating_system}`) : null },
        { label: t("propertyDetails.energyClass"), value: energy_classValue },
        { label: t("propertyDetails.floorTypes.title"), value: floor_type ? t(`propertyDetails.floorTypes.${floor_type}`) : null },
        { label: t("propertyDetails.openingFrames.title"), value: opening_frames ? t(`propertyDetails.openingFrames.${opening_frames}`) : null },
        { label: t("propertyDetails.yearBuilt"), value: construction_year },
    ]);

    const landTableData = createTableRow([
        { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
        { label: t("propertyDetails.landArea"), value: `${land_area} m²` },
        { label: t("propertyDetails.cover_coefficient"), value: cover_coefficient ? `${cover_coefficient} %` : null },
        { label: t("propertyDetails.building_coefficient"), value: building_coefficient ? `${building_coefficient} %` : null },
        { label: t("propertyDetails.lengthOfFacade"), value: length_of_facade ? `${length_of_facade} m` : null },
        { label: t("propertyDetails.orientationTypes.title"), value: orientation ? t(`propertyDetails.orientationTypes.${orientation}`) : null },
        { label: t("propertyDetails.viewTypes.title"), value: view ? t(`propertyDetails.viewTypes.${view}`) : null },
        { label: t("propertyDetails.zoneTypes.title"), value: zone ? t(`propertyDetails.zoneTypes.${zone}`) : null },
        { label: t("propertyDetails.slopeTypes.title"), value: slope ? t(`propertyDetails.slopeTypes.${slope}`) : null },
        { label: t("propertyDetails.distanceFromSea"), value: distance_from_sea ? `${distance_from_sea} m` : null },
    ]);

    const commercialTableData = createTableRow([
        { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
        { label: t("propertyDetails.floorArea"), value: floor_area ? `${floor_area} m²` : null },
        { label: t("propertyDetails.landArea"), value: land_area ? `${land_area} m²` : null },
        { label: t("propertyDetails.floorLevel"), value: floorValue },
        { label: t("propertyDetails.levels"), value: levels },
        { label: t("propertyDetails.rooms"), value: rooms },
        { label: t("propertyDetails.bathrooms"), value: bathrooms },
        { label: t("propertyDetails.wc"), value: wc },
        { label: t("propertyDetails.heating_system.title"), value: heating_system ? t(`propertyDetails.heating_system.${heating_system}`) : null },
        { label: t("propertyDetails.energyClass"), value: energy_classValue },
        { label: t("propertyDetails.powerType.title"), value: power_type ? t(`propertyDetails.powerType.${power_type}`) : null },
        { label: t("propertyDetails.yearBuilt"), value: construction_year },
    ]);


    const AmenitiesSection = () => {
        if (!amenitiesList || amenitiesList.length === 0) return null;

        return (
            <div className="col-12 px-4 my-3">
                <h3>{t("amenities.title")}</h3>
                <div className="d-flex flex-wrap gap-2">
                    {amenitiesList.map((amenity, idx) => (
                        <span
                            key={idx}
                            style={{
                                backgroundColor: '#847c3d',
                                color: '#fff',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '12px',
                            }}
                        >
                            {lng === "el" ? amenity.name_gr : amenity.name}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    // PDF Generation
    const generatePDF = async () => {
        const input = pdfRef.current;
        if (!input) {
            message.error('Unable to generate PDF');
            return;
        }

        setIsGenerating(true);
        message.loading(t('brochure.generatingPdf'), 0);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const canvas = await html2canvas(input, {
                useCORS: true,
                allowTaint: true,
                scale: 3,
                logging: false,
                imageTimeout: 0,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("l", "mm", "a4");
            const imgWidth = 297;
            const pageHeight = 210;
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

            const filename = `listing_AE000${listing?.id}_${new Date().getTime()}.pdf`;
            pdf.save(filename);

            message.destroy();
            message.success(t('brochure.downloadSuccess'));
        } catch (error) {
            console.error('PDF generation error:', error);
            message.destroy();
            message.error(t('brochure.error'));
        } finally {
            setIsGenerating(false);
        }
    };

    // Fallback image component
    const ImagePlaceholder = ({ text = "No Image" }) => (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '14px',
            fontWeight: 500,
        }}>
            {text}
        </div>
    );

    return (
        <>
            <div ref={pdfRef} className={styles.BrochureContainer} style={{ width: "297mm" }}>
                <div style={{ width: "297mm", background: "transparent" }} className="d-flex flex-column">
                    {/* PAGE 1 */}
                    <div style={{ height: "210mm", width: "297mm", background: "transparent" }} className={`m-0 p-0 ${styles.ContainerWrapper}`}>
                        <div className="d-flex flex-column m-0 p-0 justify-content-between">
                            {/* Logo */}
                            <div className={`${styles.BrochureLogo} d-flex ps-4`}>
                                <img src={logo} alt="logo" style={{ width: "200px", height: "100px" }} className="me-auto m-1" />
                            </div>

                            {/* Images */}
                            <div className="d-flex justify-content-around">
                                <div className="col-6 ps-3 pe-1">
                                    <div className={styles.Image} style={{ backgroundImage: primaryImage ? `url(${primaryImage})` : 'none' }}>
                                        {!primaryImage && <ImagePlaceholder />}
                                    </div>
                                </div>
                                <div className="col-6 pe-3 d-flex flex-column mt-auto">
                                    <div>
                                        <div className={styles.ImageWrapper} style={{ backgroundImage: secondaryImage2 ? `url(${secondaryImage2})` : 'none' }}>
                                            {!secondaryImage2 && <ImagePlaceholder text="Image 2" />}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.ImageWrapper} style={{ backgroundImage: secondaryImage1 ? `url(${secondaryImage1})` : 'none' }}>
                                            {!secondaryImage1 && <ImagePlaceholder text="Image 3" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Bar */}
                            <div className={`d-flex align-items-center mt-auto ${styles.OliveBg} ${styles.FooterPosition}`} style={{ width: "297.5mm" }}>
                                <div className="col-8 ps-2">
                                    <div className={styles.TextSize}>
                                        <div>
                                            {typeReady && (
                                                <>
                                                    {saleType} {type === "land" ? translatedType : translatedSubType}
                                                    {municipalityName && `, ${municipalityName}`}
                                                    {props.postcode && `, ${props.postcode}`}
                                                </>
                                            )}
                                        </div>
                                        <p className="h5">
                                            ID: AE000{id}, {t("propertyDetails.price")}: {currency} {priceValue}
                                        </p>
                                    </div>
                                </div>
                                <div className={`col-4 ms-auto me-5 ${styles.TextSize}`}>
                                    <PropertyIcons />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 2 */}
                    <div style={{ height: "210mm", width: "297mm", background: "transparent" }} className={`d-flex flex-column align-items-center justify-content-between m-0 p-0 ${styles.ContainerWrapper}`}>
                        {/* Description */}
                        <div className="col-12 p-4">
                            <div className={styles.BrochureDescription}>
                                <p className="h2">
                                    {lng === "el" ? t("propertyDetails.description_gr") : t("propertyDetails.description")}
                                </p>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{description || t("brochure.noDescription")}</p>
                            </div>
                        </div>

                        {/* <AmenitiesSection /> */}

                        {/* Details Table & Map */}
                        <div className="d-flex col-12 justify-content-around mb-auto">
                            <div className="col-4 ps-5">
                                {type === "residential" && residentialTableData}
                                {type === "commercial" && commercialTableData}
                                {type === "land" && landTableData}
                            </div>
                            <div className="col-7">
                                {mapImageUrl ? (
                                    <img
                                        loading="lazy"
                                        src={mapImageUrl}
                                        alt="Property location map"
                                        className={styles.ImageMap}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className={styles.ImageMap} style={{
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#999'
                                    }}>
                                        Map unavailable
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`d-flex w-100 justify-content-between mt-auto px-2 ${styles.Footer} ${styles.OliveBg} ${styles.FooterPosition}`} style={{ width: "297.5mm" }}>
                            <div className="col-5 pe-0">
                                <p className="m-0 border-end border-dark me-3">
                                    {t("footer.contact.address")} {t("footer.contact.city")}
                                </p>
                            </div>
                            <div className="col-4">
                                <p className="my-0 border-end border-dark me-5 ps-4">
                                    <Trans i18nKey="footer.contact.email" components={{
                                        1: <Link to="/contact" className={styles.link} />
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
            </div>

            {/* Download Button */}
            {showDownloadButton && (
                <button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className={`${btnStyles.Button} ${btnStyles.AngryOceanOutline}`}
                    style={{
                        marginBottom: "auto",
                        marginLeft: "20px",
                        marginTop: "20px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: isGenerating ? 0.6 : 1,
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isGenerating ? (
                        <>
                            <Spin size="small" />
                            {t("brochure.generatingPdf")}
                        </>
                    ) : (
                        <>
                            <DownloadOutlined />
                            {t("brochure.downloadPdf")}
                        </>
                    )}
                </button>
            )}
        </>
    );
};

export default Brochure;