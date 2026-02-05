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

    // Safe image access
    const getImage = (index) => images?.[index]?.url || null;
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
        return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=600x300&maptype=roadmap&markers=color:brown%7Clabel:A%7C${latitude},${longitude}&key=${API_KEY}`;
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

        const suffixes = { 1: "first", 2: "second", 3: "third" };
        const suffix = suffixes[props.floor] || "th";
        return <span>{props.floor}<sup>{t(`propertyDetails.floorValue.${suffix}`)}</sup></span>;
    };

    const floorValue = getFloorValue();
    const energy_classValue = energy_class === "to_be_issued"
        ? t("propertyDetails.energyClassTypes.toBeIssued")
        : energy_class;
    const land_areaValue = land_area === "" || land_area === null || land_area === 0
        ? "N/A"
        : `${land_area} m²`;

    // Property icons - NO ICONS VERSION
    const PropertyIcons = () => {
        if (type === "land") {
            return (
                <div className={`${listingStyles.Listing__fontawsome} d-flex`}>
                    <p>{land_area} m²</p>
                </div>
            );
        }
        if (type === "commercial") {
            return (
                <div className={`${listingStyles.Listing__fontawsome} d-flex`}>
                    <p>{floor_area} m²</p>
                </div>
            );
        }
        // Residential
        return (
            <div className={`${listingStyles.Listing__fontawsome} d-flex gap-3`}>
                <p>{bedrooms} {t("propertyDetails.bed")}</p>
                <p>{bathrooms} {t("propertyDetails.bath")}</p>
                <p>
                    {props.sub_type === "maisonette"
                        ? `${levels} ${t("propertyDetails.levels")}`
                        : floorValue
                    }
                </p>
            </div>
        );
    };

    // Compact table with only essential fields
    const createCompactTable = (features) => (
        <table className={`${styles.Listing__table} shadow`} style={{ fontSize: '11px' }}>
            <tbody>
                {features.filter(f => f.value !== null && f.value !== undefined && f.value !== "").map((feature, index) => (
                    <tr key={index}>
                        <td className={styles.tdWidth} style={{ padding: '4px 8px' }}>{feature.label}</td>
                        <td style={{ padding: '4px 8px' }}>{feature.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Get table data based on type
    const getTableData = () => {
        if (type === "residential") {
            return createCompactTable([
                { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
                { label: t("propertyDetails.floorArea"), value: floor_area ? `${floor_area} m²` : null },
                { label: t("propertyDetails.bedrooms"), value: bedrooms },
                { label: t("propertyDetails.bathrooms"), value: bathrooms },
                { label: t("propertyDetails.floorLevel"), value: type === "residential" && props.sub_type !== "maisonette" ? floorValue : t("propertyDetails.floorValue.ground") },
                { label: t("propertyDetails.heating_system.title"), value: heating_system ? t(`propertyDetails.heating_system.${heating_system}`) : null },
                { label: t("propertyDetails.energyClass"), value: energy_classValue },
                { label: t("propertyDetails.yearBuilt"), value: construction_year },
            ]);
        }

        if (type === "land") {
            return createCompactTable([
                { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
                { label: t("propertyDetails.landArea"), value: `${land_area} m²` },
                { label: t("propertyDetails.cover_coefficient"), value: cover_coefficient ? `${cover_coefficient} %` : null },
                { label: t("propertyDetails.building_coefficient"), value: building_coefficient ? `${building_coefficient} %` : null },
                { label: t("propertyDetails.zoneTypes.title"), value: zone ? t(`propertyDetails.zoneTypes.${zone}`) : null },
                { label: t("propertyDetails.distanceFromSea"), value: distance_from_sea ? `${distance_from_sea} m` : null },
            ]);
        }

        // Commercial
        return createCompactTable([
            { label: t("propertyDetails.price"), value: `${currency} ${priceValue}` },
            { label: t("propertyDetails.floorArea"), value: floor_area ? `${floor_area} m²` : null },
            { label: t("propertyDetails.rooms"), value: rooms },
            { label: t("propertyDetails.floorLevel"), value: floorValue },
            { label: t("propertyDetails.heating_system.title"), value: heating_system ? t(`propertyDetails.heating_system.${heating_system}`) : null },
            { label: t("propertyDetails.energyClass"), value: energy_classValue },
            { label: t("propertyDetails.yearBuilt"), value: construction_year },
        ]);
    };

    // Amenities component - compact version
    const AmenitiesSection = () => {
        if (!amenitiesList || amenitiesList.length === 0) return null;

        const displayAmenities = amenitiesList.slice(0, 12);

        return (
            <div style={{ marginTop: '12px' }}>
                <h5 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: '#847c3d'
                }}>
                    {t("propertyDetails.amenities")}
                </h5>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                }}>
                    {displayAmenities.map((amenity, idx) => (
                        <span
                            key={idx}
                            style={{
                                backgroundColor: '#847c3d',
                                color: '#fff',
                                padding: '3px 10px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {lng === "el" ? amenity.name_gr : amenity.name}
                        </span>
                    ))}
                    {amenitiesList.length > 12 && (
                        <span style={{
                            padding: '3px 10px',
                            fontSize: '10px',
                            color: '#666',
                        }}>
                            +{amenitiesList.length - 12} {t("propertyDetails.more")}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // PDF Generation
    const generatePDF = async () => {
        const input = pdfRef.current;
        if (!input) {
            message.error(t('brochure.errorGenerate'));
            return;
        }

        setIsGenerating(true);
        message.loading(t('brochure.generating'), 0);

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
            message.success(t('brochure.success'));
        } catch (error) {
            console.error('PDF generation error:', error);
            message.destroy();
            message.error(t('brochure.error'));
        } finally {
            setIsGenerating(false);
        }
    };

    // Image placeholder
    const ImagePlaceholder = ({ text }) => (
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
            {text || t('brochure.noImage')}
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
                                            {!secondaryImage2 && <ImagePlaceholder text={t('brochure.image2')} />}
                                        </div>
                                    </div>
                                    <div>
                                        <div className={styles.ImageWrapper} style={{ backgroundImage: secondaryImage1 ? `url(${secondaryImage1})` : 'none' }}>
                                            {!secondaryImage1 && <ImagePlaceholder text={t('brochure.image3')} />}
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
                                        <p className="h5">ID: AE000{id}, {t("propertyDetails.price")}: {currency} {priceValue}</p>
                                    </div>
                                </div>
                                <div className={`col-4 ms-auto me-5 ${styles.TextSize}`}>
                                    <PropertyIcons />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 2 - OPTIMIZED LAYOUT */}
                    <div style={{ height: "210mm", width: "297mm", background: "transparent", position: 'relative' }} className={`d-flex flex-column m-0 p-0 ${styles.ContainerWrapper}`}>
                        {/* Description - Compact */}
                        <div className="col-12 px-4 pt-3 pb-2">
                            <div className={styles.BrochureDescription}>
                                <p className="h3" style={{ marginBottom: '8px', fontSize: '20px' }}>
                                    {lng === "el" ? t("propertyDetails.description_gr") : t("propertyDetails.description")}
                                </p>
                                <p style={{
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '12px',
                                    lineHeight: '1.4',
                                    maxHeight: '80px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {description || t("brochure.noDescription")}
                                </p>
                            </div>
                        </div>

                        {/* Table, Amenities & Map */}
                        <div className="d-flex col-12 px-4" style={{ flex: 1, minHeight: 0 }}>
                            {/* Left column - Table + Amenities */}
                            <div className="col-5 pe-3" style={{ display: 'flex', flexDirection: 'column' }}>
                                {getTableData()}
                                <AmenitiesSection />
                            </div>

                            {/* Right column - Map */}
                            <div className="col-7 ps-2">
                                {mapImageUrl ? (
                                    <img
                                        loading="lazy"
                                        src={mapImageUrl}
                                        alt={t('brochure.mapAlt')}
                                        className={styles.ImageMap}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: '320px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '320px',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#999',
                                        borderRadius: '8px'
                                    }}>
                                        {t('brochure.mapUnavailable')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer - Fixed at bottom */}
                        <div className={`d-flex w-100 justify-content-between px-2 ${styles.Footer} ${styles.OliveBg} ${styles.FooterPosition}`} style={{
                            width: "297.5mm",
                            marginTop: 'auto',
                            position: 'absolute',
                            bottom: 0,
                            left: 0
                        }}>
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
                                <p className="m-0 w-100">{t("footer.contact.phone")}</p>
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
                            {t('brochure.generating')}
                        </>
                    ) : (
                        <>
                            <DownloadOutlined />
                            {t('brochure.download')}
                        </>
                    )}
                </button>
            )}
        </>
    );
};

export default Brochure;