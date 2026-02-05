import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ListingCreateEditForm.module.css";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import useUserStatus from "../../hooks/useUserStatus";
import useFetchOwners from "hooks/useFetchOwners";
import { useTranslation } from "react-i18next";

import {
    Steps,
    Card,
    Button,
    Space,
    Typography,
    Descriptions,
    Tag,
    Spin,
    Popconfirm
} from 'antd';
import {
    PictureOutlined,
    InfoCircleOutlined,
    EnvironmentOutlined,
    ToolOutlined,
    CheckCircleOutlined,
    SaveOutlined,
    CloseOutlined,
    EditOutlined,
    LockOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { App } from 'antd';

import LocationFields from "components/createEditFormFields/LocationFields";
import Forbidden403 from "../errors/Forbidden403";
import DragDropImageUpload from "components/DragDropImageUpload";
import Description from "components/createEditFormFields/Description";
import Owner from "components/createEditFormFields/Owner";
import TypeSaleSub from "components/createEditFormFields/TypeSaleSub";
import CurrencyPriceAvailability from "components/createEditFormFields/CurrencyPriceAvailability";
import ResidentialFields from "components/createEditFormFields/ResidentialFields";
import CommercialFields from "components/createEditFormFields/CommercialFields";
import LandFields from "components/createEditFormFields/LandFields";
import useFetchLocationData from "hooks/useFetchLocationData";
import { AmenitiesResidential } from "components/createEditFormFields/amenities/AmenitiesResidential";
import { AmenitiesCommercial } from "components/createEditFormFields/amenities/AmenitiesCommercial";
import { AmenitiesLand } from "components/createEditFormFields/amenities/AmenitiesLand";
import { ApprovedFeatureCheckbox } from "components/createEditFormFields/ApprovedFeatureCheckbox";

const { Title } = Typography;

function AdminListingEditForm() {
    useRedirect("loggedOut");
    const { message: antMessage } = App.useApp();
    const [listingData, setListingData] = useState({
        type: "",
        sub_type: "",
        sale_type: "",
        price: "",
        currency: "EUR",
        description: "",
        description_gr: "",
        address_number: "",
        address_street: "",
        address_street_gr: "",
        postcode: "",
        municipality_gr: "",
        floor_area: "",
        land_area: "",
        levels: "",
        bedrooms: "",
        wc: "",
        floor: "",
        kitchens: "",
        bathrooms: "",
        living_rooms: "",
        heating_system: "",
        energy_class: "",
        power_type: "",
        floor_type: "",
        construction_year: "",
        latitude: "0.0",
        longitude: "0.0",
        cover_coefficient: "",
        building_coefficient: "",
        length_of_facade: "",
        orientation: "",
        view: "",
        slope: "",
        zone: "",
        distance_from_sea: "",
        rooms: "",
        approved: false,
        featured: false,
        region_id: "",
        county_id: "",
        municipality_id: "",
        listing_owner: "",
    });

    const [errors, setErrors] = useState({});
    const history = useHistory();
    const { id } = useParams();
    const userStatus = useUserStatus();
    const { regionsData } = useFetchLocationData();

    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");

    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const lng = i18n?.language;
    const { owners, hasLoaded: ownersLoaded } = useFetchOwners();
    const owner = owners.reduce((map, owner) => {
        map[owner.id] = `${owner.first_name} ${owner.last_name}`;
        return map;
    }, {});

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/listings/${id}/`);

                setListingData({
                    type: data.type || "",
                    sub_type: data.sub_type || "",
                    sale_type: data.sale_type || "",
                    price: data.price || "",
                    currency: data.currency || "",
                    description: data.description || "",
                    description_gr: data.description_gr || "",
                    address_number: data.address_number || "",
                    address_street: data.address_street || "",
                    address_street_gr: data.address_street_gr || "",
                    postcode: data.postcode || "",
                    municipality: data.municipality || "",
                    municipality_gr: data.municipality_gr || "",
                    county: data.county || "",
                    county_gr: data.county_gr || "",
                    region: data.region || "",
                    region_gr: data.region_gr || "",
                    floor_area: data.floor_area || "",
                    land_area: data.land_area || "",
                    levels: data.levels || "",
                    bedrooms: data.bedrooms || "",
                    wc: data.wc || "",
                    floor: data.floor || "",
                    kitchens: data.kitchens || "",
                    bathrooms: data.bathrooms || "",
                    living_rooms: data.living_rooms || "",
                    rooms: data.rooms || "",
                    power_type: data.power_type || "",
                    power_type_gr: data.power_type_gr || "",
                    heating_system: data.heating_system || "",
                    heating_system_gr: data.heating_system_gr || "",
                    energy_class: data.energy_class || "",
                    floor_type: data.floor_type || "",
                    construction_year: data.construction_year || "",
                    availability: data.availability || "",
                    latitude: data.latitude || "0.0",
                    longitude: data.longitude || "0.0",
                    service_charge: data.service_charge || "",
                    renovation_year: data.renovation_year || "",
                    opening_frames: data.opening_frames || "",
                    type_of_glass: data.type_of_glass || "",
                    building_coefficient: data.building_coefficient || "",
                    cover_coefficient: data.cover_coefficient || "",
                    length_of_facade: data.length_of_facade || "",
                    orientation: data.orientation || "",
                    view: data.view || "",
                    slope: data.slope || "",
                    zone: data.zone || "",
                    distance_from_sea: data.distance_from_sea || "",
                    distance_from_city: data.distance_from_city || "",
                    distance_from_airport: data.distance_from_airport || "",
                    distance_from_village: data.distance_from_village || "",
                    distance_from_port: data.distance_from_port || "",
                    images: data.images || [],
                    amenities: data.amenities || [],
                    approved: data.approved || false,
                    featured: data.featured || false,
                    region_id: data.region_id || "",
                    county_id: data.county_id || "",
                    municipality_id: data.municipality_id || "",
                    listing_owner: data.listing_owner || "",
                });

                // Set existing images
                if (data.images && data.images.length > 0) {
                    setExistingImages(data.images);
                }

                // Set selected amenities - CONVERT TO INTEGERS
                const amenityIds = data.amenities?.map((amenity) =>
                    typeof amenity.id === 'string' ? parseInt(amenity.id, 10) : amenity.id
                ) || [];
                setSelectedAmenities(amenityIds);

                // Set location states
                setSelectedRegion(data.region_id || "");
                setSelectedCounty(data.county_id || "");
                setSelectedMunicipality(data.municipality_id || "");

                setIsLoading(false);
            } catch (err) {
                console.error('Error loading listing:', err);
                if (err.response?.status === 403) {
                    history.push('/forbidden');
                }
                setIsLoading(false);
            }
        };
        handleMount();
    }, [id, history]);

    const handleChecked = (e) => {
        setListingData({
            ...listingData,
            [e.target.name]: e.target.checked,
        });
    };

    const handleChange = (e) => {
        setListingData({
            ...listingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAmenityChange = (amenityId) => {
        // Ensure amenityId is an integer
        const id = typeof amenityId === 'string' ? parseInt(amenityId, 10) : amenityId;

        setSelectedAmenities((prev) =>
            prev.includes(id)
                ? prev.filter((existingId) => existingId !== id)
                : [...prev, id]
        );
    };

    const handleRegionChange = region => {
        setSelectedRegion(region);
        setListingData((prevData) => ({
            ...prevData,
            region_id: region,
        }));
        setSelectedCounty("");
        setSelectedMunicipality("");
    };

    const handleCountyChange = county => {
        setSelectedCounty(county);
        setListingData((prevData) => ({
            ...prevData,
            county_id: county,
        }));
        setSelectedMunicipality("");
    };

    const handleMunicipalityChange = (municipality, municipality_gr) => {
        setSelectedMunicipality(municipality);
        setListingData((prevData) => ({
            ...prevData,
            municipality_id: municipality,
            municipality_gr: municipality_gr,
        }));
    };

    const regionNameEn = regionsData
        .find((region) => region.id === selectedRegion)
        ?.englishName || "";
    const regionNameGr = regionsData
        .find((region) => region.id === selectedRegion)
        ?.greekName || "";

    const countyNameEn = regionsData
        .find((region) => region.id === selectedRegion)
        ?.counties.find((county) => county.id === selectedCounty)
        ?.englishName || "";

    const countyNameGr = regionsData
        .find((region) => region.id === selectedRegion)
        ?.counties.find((county) => county.id === selectedCounty)
        ?.greekName || "";

    const municipalityNameGr = regionsData
        .find((region) => region.id === selectedRegion)
        ?.counties.find((county) => county.id === selectedCounty)
        ?.municipalities.find((municipality) => municipality.id === selectedMunicipality)
        ?.greekName || "";

    const municipalityNameEn = regionsData
        .find((region) => region.id === selectedRegion)
        ?.counties.find((county) => county.id === selectedCounty)
        ?.municipalities.find((municipality) => municipality.id === selectedMunicipality)
        ?.englishName || "";

    const regionName = lng === 'el' ? regionNameGr : regionNameEn;
    const countyName = lng === 'el' ? countyNameGr : countyNameEn;
    const municipalityName = lng === 'el' ? municipalityNameGr : municipalityNameEn;

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 0:
                // Images are now optional - user can skip this step
                break;
            case 1:
                if (!listingData.type) newErrors.type = [t("admin.listingsForms.stepErrors.typeIsRequired")];
                if (!listingData.sale_type) newErrors.sale_type = [t("admin.listingsForms.stepErrors.saleTypeIsRequired")];
                if (!listingData.price) newErrors.price = [t("admin.listingsForms.stepErrors.priceIsRequired")];
                if (!listingData.listing_owner) newErrors.listing_owner = [t("admin.listingsForms.stepErrors.ownerIsRequired")];
                if (!listingData.description) newErrors.description = [t("admin.listingsForms.stepErrors.descriptionIsRequired")];
                if (!listingData.description_gr) newErrors.description_gr = [t("admin.listingsForms.stepErrors.descriptionIsRequired")];
                break;
            case 2:
                if (!listingData.region_id) newErrors.region_id = [t("admin.listingsForms.stepErrors.regionIsRequired")];
                if (!listingData.county_id) newErrors.county_id = [t("admin.listingsForms.stepErrors.countyIsRequired")];
                if (!listingData.municipality_id) newErrors.municipality_id = [t("admin.listingsForms.stepErrors.municipalityIsRequired")];
                if (!listingData.latitude || listingData.latitude === "0.0") newErrors.latitude = [t("admin.listingsForms.stepErrors.latitudeIsRequired")];
                if (!listingData.longitude || listingData.longitude === "0.0") newErrors.longitude = [t("admin.listingsForms.stepErrors.longitudeIsRequired")];
                break;
            case 3:
                if (listingData.type === 'residential' && !listingData.floor_area) {
                    newErrors.floor_area = [t("admin.listingsForms.stepErrors.floorAreaIsRequired")];
                }
                if (listingData.type === 'commercial' && !listingData.floor_area) {
                    newErrors.floor_area = [t("admin.listingsForms.stepErrors.floorAreaIsRequired")];
                }
                if (listingData.type === 'land' && !listingData.land_area) {
                    newErrors.land_area = [t("admin.listingsForms.stepErrors.landAreaIsRequired")];
                }
                break;
            case 4:
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            antMessage.error('Please fill in all required fields');
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToStep = (step) => {
        if (completedSteps.includes(step) || step === Math.max(...completedSteps, -1) + 1) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderTextField = (fieldName, label, type = "text", rows = 1) => (
        <Form.Group controlId={fieldName}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                className={styles.Input}
                type={type}
                name={fieldName}
                value={listingData[fieldName]}
                onChange={handleChange}
                as={type === "textarea" ? "textarea" : undefined}
                rows={rows}
            />
            {errors?.[fieldName]?.map((message, idx) => (
                <Alert className={styles.Input} variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
        </Form.Group>
    );

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/listings/${id}/`);
            history.push("/listings");
        } catch (err) {
            // console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // First, delete any images marked for deletion
            if (imagesToDelete.length > 0) {
                await axiosReq.delete(`/listings/${id}/images/`, {
                    data: { image_ids: imagesToDelete }
                });
            }

            // Second, update image order if changed
            if (existingImages.length > 0) {
                const reorderedImageIds = existingImages.map((img) => img.id);
                await axiosReq.put(`/listings/${id}/images/reorder-images/`, {
                    reordered_image_ids: reorderedImageIds
                });
            }

            // Prepare form data
            const formData = new FormData();
            formData.append("type", listingData.type);
            formData.append("sub_type", listingData.sub_type);
            formData.append("sale_type", listingData.sale_type);
            formData.append("price", listingData.price || "0");
            formData.append("currency", listingData.currency);
            formData.append("description", listingData.description);
            formData.append("description_gr", listingData.description_gr);
            formData.append("address_number", listingData.address_number || "0");
            formData.append("address_street", listingData.address_street);
            formData.append("address_street_gr", listingData.address_street_gr);
            formData.append("postcode", listingData.postcode);
            formData.append("municipality", listingData.municipality);
            formData.append("municipality_gr", listingData.municipality_gr);
            formData.append("county", listingData.county);
            formData.append("county_gr", listingData.county_gr);
            formData.append("region", listingData.region);
            formData.append("region_gr", listingData.region_gr);
            formData.append("floor_area", listingData.floor_area || "0");
            formData.append("land_area", listingData.land_area || "0");
            formData.append("levels", listingData.levels || "0");
            formData.append("bedrooms", listingData.bedrooms || "0");
            formData.append("wc", listingData.wc || "0");
            formData.append("floor", listingData.floor || "0");
            formData.append("kitchens", listingData.kitchens || "0");
            formData.append("bathrooms", listingData.bathrooms || "0");
            formData.append("living_rooms", listingData.living_rooms || "0");
            formData.append("rooms", listingData.rooms || "0");
            formData.append("power_type", listingData.power_type);
            formData.append("power_type_gr", listingData.power_type_gr);
            formData.append("heating_system", listingData.heating_system);
            formData.append("heating_system_gr", listingData.heating_system_gr);
            formData.append("energy_class", listingData.energy_class);
            formData.append("floor_type", listingData.floor_type);
            formData.append("construction_year", listingData.construction_year || "1900");
            formData.append("availability", listingData.availability || "");
            formData.append("latitude", listingData.latitude);
            formData.append("longitude", listingData.longitude);
            formData.append("service_charge", listingData.service_charge || "0");
            formData.append("renovation_year", listingData.renovation_year || "2024");
            formData.append("opening_frames", listingData.opening_frames);
            formData.append("type_of_glass", listingData.type_of_glass);
            formData.append("building_coefficient", listingData.building_coefficient || "0");
            formData.append("cover_coefficient", listingData.cover_coefficient || "0");
            formData.append("length_of_facade", listingData.length_of_facade || "0");
            formData.append("orientation", listingData.orientation);
            formData.append("view", listingData.view);
            formData.append("slope", listingData.slope);
            formData.append("zone", listingData.zone);
            formData.append("distance_from_sea", listingData.distance_from_sea || "0");
            formData.append("distance_from_city", listingData.distance_from_city || "0");
            formData.append("distance_from_airport", listingData.distance_from_airport || "0");
            formData.append("distance_from_village", listingData.distance_from_village || "0");
            formData.append("distance_from_port", listingData.distance_from_port || "0");
            formData.append("amenities", listingData.amenities);
            formData.append("approved", listingData.approved);
            formData.append("featured", listingData.featured);
            formData.append("is_first", listingData.is_first || "0");
            formData.append("region_id", listingData.region_id);
            formData.append("county_id", listingData.county_id);
            formData.append("municipality_id", listingData.municipality_id);
            formData.append("listing_owner", listingData.listing_owner || "");

            // Append amenities - ROBUST INTEGER CONVERSION
            const amenityIds = selectedAmenities
                .map(amenity => {
                    // Handle string, number, or object
                    if (typeof amenity === 'object' && amenity !== null) {
                        return parseInt(amenity.id, 10);
                    }
                    return parseInt(amenity, 10);
                })
                .filter(id => !isNaN(id)); // Filter out any NaN values

            amenityIds.forEach((amenityId) => {
                formData.append("amenities_ids", amenityId);
            });

            // === EXISTING IMAGES (Order + Description) ===
            if (existingImages.length > 0) {
                existingImages.forEach((image) => {
                    formData.append('existing_image_ids', image.id);
                    formData.append('existing_image_orders', image.order);
                    formData.append('existing_image_descriptions', image.description || "");  // ← SEND DESCRIPTION
                });
            }

            // === DELETE IMAGES ===
            if (imagesToDelete.length > 0) {
                imagesToDelete.forEach((imageId) => {
                    formData.append('images_to_delete', imageId);
                });
            }

            // === NEW IMAGES (with descriptions) ===
            if (uploadedImages.length > 0) {
                uploadedImages.forEach((image) => {
                    formData.append('uploaded_images', image.file);
                    formData.append('image_orders', image.order);
                    formData.append('image_descriptions', image.description || "");
                });
            }

            // === AMENITIES ===
            selectedAmenities.forEach((amenity) => {
                formData.append("amenities_ids", parseInt(amenity, 10));
            });

            // Update listing
            const { data } = await axiosReq.put(`/listings/${id}/`, formData);

            antMessage.success('Listing updated successfully!');
            window.scrollTo(0, 0);
            history.push(`/listings/${data.id}`);
        } catch (err) {
            console.error('Submit error:', err);
            setErrors(err.response?.data || {});
            antMessage.error('Failed to update listing. Please check the form.');
            setIsSubmitting(false);
            window.scrollTo(0, 0);
        }
    };

    const steps = [
        { title: t("admin.listingsForms.images"), icon: <PictureOutlined /> },
        { title: t("admin.listingsForms.basicInfo"), icon: <InfoCircleOutlined /> },
        { title: t("admin.listingsForms.location"), icon: <EnvironmentOutlined /> },
        { title: t("admin.listingsForms.details"), icon: <ToolOutlined /> },
        { title: t("admin.listingsForms.amenities"), icon: <SaveOutlined /> },
        { title: t("admin.listingsForms.review"), icon: <CheckCircleOutlined /> },
    ];

    if (userStatus === false) {
        return <Forbidden403 />;
    }

    if (!ownersLoaded || isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '94px 24px 24px 24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Card style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
                    {t("admin.listingsForms.editListing")}
                </Title>

                <Steps
                    current={currentStep}
                    items={steps.map((item, index) => {
                        const isCompleted = completedSteps.includes(index);
                        const isAccessible = isCompleted || index === Math.max(...completedSteps, -1) + 1;

                        let stepIcon;
                        if (isCompleted) {
                            stepIcon = <CheckCircleOutlined />;
                        } else if (isAccessible) {
                            stepIcon = item.icon || <InfoCircleOutlined />;
                        } else {
                            stepIcon = <LockOutlined />;
                        }

                        return {
                            title: item.title,
                            icon: stepIcon,
                            disabled: !isAccessible,
                            style: {
                                cursor: isAccessible ? 'pointer' : 'not-allowed',
                                opacity: isAccessible ? 1 : 0.5
                            }
                        };
                    })}
                    onChange={(current) => {
                        // Handle click
                        const isAccessible = completedSteps.includes(current) ||
                            current === Math.max(...completedSteps, -1) + 1;
                        if (isAccessible) {
                            goToStep(current);
                        }
                    }}
                    style={{ marginBottom: '32px' }}
                />

                <div style={{ minHeight: '400px' }}>
                    {/* Step 0: Images */}
                    {currentStep === 0 && (
                        <div>
                            <Popconfirm
                                title={t("admin.listingsForms.confirmDelete")}
                                onConfirm={handleDelete}
                                okText={t("admin.listingsForms.yes")}
                                cancelText={t("admin.listingsForms.no")}
                            >
                                <Button danger icon={<DeleteOutlined />} size="small"
                                    style={{ marginLeft: 'auto', display: 'block' , padding: '4px 10px' }}>
                                    {t("admin.listingsForms.deleteListing")}
                                </Button>
                            </Popconfirm>
                            <Title level={4}>{t("admin.listingsForms.propertyImagesOptional")}</Title>

                            {/* New Images Upload */}
                            <h5>{t("admin.listingsForms.addNewImages")}</h5>
                            <DragDropImageUpload
                                uploadedImages={uploadedImages}
                                setUploadedImages={setUploadedImages}
                                error={errors?.images}
                                maxImages={40 - existingImages.length}
                                existingImages={existingImages}
                                setExistingImages={setExistingImages}
                                imagesToDelete={imagesToDelete}
                                setImagesToDelete={setImagesToDelete}
                            />
                        </div>
                    )}

                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div>
                            <Title level={4}>{t("admin.listingsForms.basicInfo")}</Title>
                            <Owner
                                listingData={listingData}
                                handleChange={handleChange}
                                handleChecked={handleChecked}
                                owners={owners}
                                errors={errors}
                            />
                            <TypeSaleSub
                                listingData={listingData}
                                handleChange={handleChange}
                                owners={owners}
                                errors={errors}
                                t={t}
                            />
                            <CurrencyPriceAvailability
                                listingData={listingData}
                                handleChange={handleChange}
                                errors={errors}
                                t={t}
                            />
                            <Description
                                listingData={listingData}
                                handleChange={handleChange}
                                errors={errors}
                                t={t}
                            />
                        </div>
                    )}

                    {/* Step 2: Location */}
                    {currentStep === 2 && (
                        <div>
                            <Title level={4}>{t("admin.listingsForms.locationDetails")}</Title>
                            <LocationFields
                                listingData={listingData}
                                handleChange={handleChange}
                                errors={errors}
                                onRegionChange={handleRegionChange}
                                onCountyChange={handleCountyChange}
                                onMunicipalityChange={handleMunicipalityChange}
                                selectedRegion={selectedRegion}
                                selectedCounty={selectedCounty}
                                selectedMunicipality={selectedMunicipality}
                                renderTextField={renderTextField}
                                t={t}
                            />
                        </div>
                    )}

                    {/* Step 3: Technical Details & Amenities */}
                    {currentStep === 3 && (
                        <div>
                            <Title level={4}>{t("admin.listingsForms.technicalDetails")}</Title>
                            {listingData.type === 'residential' && (
                                <ResidentialFields
                                    listingData={listingData}
                                    handleChange={handleChange}
                                    errors={errors}
                                    t={t}
                                    renderTextField={renderTextField}
                                    handleAmenityChange={handleAmenityChange}
                                    selectedAmenities={selectedAmenities}
                                />
                            )}
                            {listingData.type === 'commercial' && (
                                <CommercialFields
                                    listingData={listingData}
                                    handleChange={handleChange}
                                    errors={errors}
                                    t={t}
                                    renderTextField={renderTextField}
                                    handleAmenityChange={handleAmenityChange}
                                    selectedAmenities={selectedAmenities}
                                />
                            )}
                            {listingData.type === 'land' && (
                                <LandFields
                                    listingData={listingData}
                                    handleChange={handleChange}
                                    errors={errors}
                                    t={t}
                                    renderTextField={renderTextField}
                                    handleAmenityChange={handleAmenityChange}
                                    selectedAmenities={selectedAmenities}
                                />
                            )}
                        </div>
                    )}

                    {/* Step 4: Amenities */}
                    {currentStep === 4 && (
                        <div>
                            <Title level={4}>{t("admin.listingsForms.technicalDetails")}</Title>
                            {listingData.type === 'residential' && (
                                <AmenitiesResidential
                                    handleAmenityChange={handleAmenityChange}
                                    selectedAmenities={selectedAmenities}
                                    create={true}
                                />
                            )}
                            {listingData.type === 'commercial' && (
                                <AmenitiesCommercial
                                    handleAmenityChange={handleAmenityChange}
                                    selectedAmenities={selectedAmenities}
                                    create={true}
                                />
                            )}
                            {listingData.type === 'land' && (
                                <AmenitiesLand
                                    handleAmenityChange={handleAmenityChange}
                                    selectedAmenities={selectedAmenities}
                                    create={true}
                                />
                            )}
                            <Card
                                variant={false}
                                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '24px' }}
                            >
                                <ApprovedFeatureCheckbox
                                    listingData={listingData}
                                    handleChecked={handleChecked}
                                    errors={errors}
                                    t={t}
                                />
                            </Card>
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div>
                            <Title level={4} style={{ textAlign: 'center' }}>{t("admin.listingsForms.reviewYourChanges")}</Title>
                            <Descriptions bordered column={2} style={{ marginTop: '24px' }}>
                                <Descriptions.Item label={t("admin.listingsForms.images")} span={2}>
                                    <Tag color="blue">{t("admin.listingsForms.totalImages", { count: existingImages.length + uploadedImages.length, max: 40 })} </Tag>
                                    <Tag color="green">{uploadedImages.length} {t("admin.listingsForms.new")}</Tag>
                                    {imagesToDelete.length > 0 && <Tag color="red">{imagesToDelete.length} {t("admin.listingsForms.toDelete")}</Tag>}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(0)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.types.title")}>{listingData.type || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.typeSale")}>{listingData.sale_type || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.price")}>
                                    {listingData.currency} {listingData.price || '-'}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(1)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.owner")}>{owner[listingData.listing_owner] || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.location")} span={2}>
                                    {t("regionOptions.region")}: {regionName}, {t("regionOptions.county")}: {countyName}, {t("regionOptions.municipality")}: {municipalityName || '-'}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(2)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("amenities.title")} span={2}>
                                    <Tag color="purple">{t("admin.listingsForms.selected")} {selectedAmenities.length}</Tag>
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(3)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        {currentStep > 0 && <Button size="large" onClick={prevStep}>{t("admin.listingsForms.previous")}</Button>}
                        <Button size="large" icon={<CloseOutlined />} onClick={() => history.push(`/listings/${id}`)}>{t("admin.listingsForms.cancel")}</Button>
                    </Space>

                    {currentStep < 5 ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={nextStep}
                            style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                        >
                            {currentStep === 0 ? t("admin.listingsForms.continue") : t("admin.listingsForms.continue")}
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            icon={<SaveOutlined />}
                            loading={isSubmitting}
                            onClick={handleSubmit}
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        >
                            {t("admin.listingsForms.updateListing")}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default AdminListingEditForm;