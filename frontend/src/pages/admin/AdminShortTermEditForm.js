import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import styles from "../../styles/ListingCreateEditForm.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import useUserStatus from "../../hooks/useUserStatus";
import Forbidden403 from "../errors/Forbidden403";
import AgentOwner from "components/createEditFormFields/Owner";
import CurrencyPrice from "components/createEditFormFields/CurrencyPriceAvailability";
import AmenitiesShortTerm from "components/createEditFormFields/amenities/AmenitiesShortTerm";
import Description from "components/createEditFormFields/Description";

import {
    Steps,
    Card,
    Button,
    Space,
    Typography,
    Descriptions,
    Tag,
    Divider,
    Spin
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
    LockOutlined
} from '@ant-design/icons';
import { App } from 'antd';

import LocationFields from "components/createEditFormFields/LocationFields";
import ShortTermFields from "components/createEditFormFields/ShortTermFields";
import useFetchOwners from "hooks/useFetchOwners";
import { useTranslation } from "react-i18next";
import DragDropImageUpload from "components/DragDropImageUpload";
import useFetchLocationData from "hooks/useFetchLocationData";
import { ApprovedFeatureCheckbox } from "components/createEditFormFields/ApprovedFeatureCheckbox";

const { Title } = Typography;

function AdminShortTermEditForm() {
    useRedirect("loggedOut");
    const { message: antMessage } = App.useApp();
    const [listingData, setListingData] = useState({
        price: "",
        currency: "",
        title: "",
        title_gr: "",
        description: "",
        description_gr: "",
        address_number: "",
        address_street: "",
        address_street_gr: "",
        postcode: "",
        municipality: "",
        floor_area: "",
        levels: "",
        bedrooms: "",
        wc: "",
        floor: "",
        kitchens: "",
        bathrooms: "",
        living_rooms: "",
        latitude: "0.0",
        longitude: "0.0",
        distance_from_sea: "",
        distance_from_city: "",
        distance_from_airport: "",
        distance_from_village: "",
        distance_from_port: "",
        approved: false,
        featured: false,
        region_id: "",
        county_id: "",
        municipality_id: "",
        listing_owner: "",
        max_guests: "",
        max_adults: "",
        max_children: "",
    });

    const [errors, setErrors] = useState({});
    const history = useHistory();
    const { id } = useParams();
    const userStatus = useUserStatus();
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [show, setShow] = useState(false);

    const { regionsData } = useFetchLocationData();

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


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/short-term-listings/${id}/`);

                setListingData({
                    price: data.price || "",
                    currency: data.currency || "EUR",
                    title: data.title || "",
                    title_gr: data.title_gr || "",
                    description: data.description || "",
                    description_gr: data.description_gr || "",
                    address_number: data.address_number || "",
                    address_street: data.address_street || "",
                    address_street_gr: data.address_street_gr || "",
                    postcode: data.postcode || "",
                    municipality: data.municipality || "",
                    floor_area: data.floor_area || "",
                    levels: data.levels || "",
                    bedrooms: data.bedrooms || "",
                    wc: data.wc || "",
                    floor: data.floor || "",
                    kitchens: data.kitchens || "",
                    bathrooms: data.bathrooms || "",
                    living_rooms: data.living_rooms || "",
                    latitude: data.latitude || "0.0",
                    longitude: data.longitude || "0.0",
                    distance_from_sea: data.distance_from_sea || "",
                    distance_from_city: data.distance_from_city || "",
                    distance_from_airport: data.distance_from_airport || "",
                    distance_from_village: data.distance_from_village || "",
                    distance_from_port: data.distance_from_port || "",
                    approved: data.approved || false,
                    featured: data.featured || false,
                    region_id: data.region_id || "",
                    county_id: data.county_id || "",
                    municipality_id: data.municipality_id || "",
                    listing_owner: data.listing_owner || "",
                    max_guests: data.max_guests || "",
                    max_adults: data.max_adults || "",
                    max_children: data.max_children || "",
                });

                // Set existing images
                if (data.images && data.images.length > 0) {
                    setExistingImages(data.images);
                }

                const amenityIds = data.amenities?.map((amenity) => {
                    const id = typeof amenity.id === 'string' ? parseInt(amenity.id, 10) : amenity.id;
                    return id;
                }) || [];

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

    const handleChange = (e) => {
        setListingData({
            ...listingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAmenityChange = (amenityId) => {

        // Ensure amenityId is an integer
        const id = typeof amenityId === 'string' ? parseInt(amenityId, 10) : amenityId;

        setSelectedAmenities((prev) => {
            const isCurrentlySelected = prev.includes(id);

            const newSelection = isCurrentlySelected
                ? prev.filter((existingId) => existingId !== id)
                : [...prev, id];
            return newSelection;
        });
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
                if (!listingData.price) newErrors.price = ["Price is required"];
                if (!listingData.listing_owner) newErrors.listing_owner = ["Owner is required"];
                break;
            case 2:
                if (!listingData.region_id) newErrors.region_id = ["Region is required"];
                if (!listingData.county_id) newErrors.county_id = ["County is required"];
                if (!listingData.municipality_id) newErrors.municipality_id = ["Municipality is required"];
                break;
            case 3:
                if (!listingData.floor_area) newErrors.floor_area = ["Floor area is required"];
                if (!listingData.max_guests) newErrors.max_guests = ["Max guests is required"];
                if (!listingData.max_adults) newErrors.max_adults = ["Max adults is required"];
                if (!listingData.max_children) newErrors.max_children = ["Max children is required"];
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // First, delete any images marked for deletion
            if (imagesToDelete.length > 0) {
                await axiosReq.delete(`/short-term-listings/${id}/images/`, {
                    data: { image_ids: imagesToDelete }
                });
            }

            // Second, update image order if changed
            if (existingImages.length > 0) {
                const reorderedImageIds = existingImages.map((img) => img.id);
                await axiosReq.put(`/short-term-listings/${id}/images/reorder-images/`, {
                    reordered_image_ids: reorderedImageIds
                });
            }

            // Prepare form data
            const formData = new FormData();
            formData.append("price", listingData.price || "0");
            formData.append("currency", listingData.currency);
            formData.append("title", listingData.title || "");
            formData.append("title_gr", listingData.title_gr || "");
            formData.append("description", listingData.description || "");
            formData.append("description_gr", listingData.description_gr || "");
            formData.append("address_number", listingData.address_number || "0");
            formData.append("address_street", listingData.address_street || "");
            formData.append("address_street_gr", listingData.address_street_gr || "");
            formData.append("postcode", listingData.postcode || "");
            formData.append("municipality", listingData.municipality || "");
            formData.append("floor_area", listingData.floor_area || "0");
            formData.append("levels", listingData.levels || "0");
            formData.append("bedrooms", listingData.bedrooms || "0");
            formData.append("wc", listingData.wc || "0");
            formData.append("floor", listingData.floor || "0");
            formData.append("kitchens", listingData.kitchens || "0");
            formData.append("bathrooms", listingData.bathrooms || "0");
            formData.append("living_rooms", listingData.living_rooms || "0");
            formData.append("latitude", listingData.latitude);
            formData.append("longitude", listingData.longitude);
            formData.append("distance_from_sea", listingData.distance_from_sea || "0");
            formData.append("distance_from_city", listingData.distance_from_city || "0");
            formData.append("distance_from_airport", listingData.distance_from_airport || "0");
            formData.append("distance_from_village", listingData.distance_from_village || "0");
            formData.append("distance_from_port", listingData.distance_from_port || "0");
            formData.append("approved", listingData.approved);
            formData.append("featured", listingData.featured);
            formData.append("region_id", listingData.region_id);
            formData.append("county_id", listingData.county_id);
            formData.append("municipality_id", listingData.municipality_id);
            formData.append("listing_owner", listingData.listing_owner);
            formData.append("max_guests", listingData.max_guests || "0");
            formData.append("max_adults", listingData.max_adults || "0");
            formData.append("max_children", listingData.max_children || "0");

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

            if (existingImages.length > 0) {
                existingImages.forEach((image) => {
                    formData.append('existing_image_ids', image.id);
                    formData.append('existing_image_orders', image.order);
                    formData.append('existing_image_descriptions', image.description || "");  // ← ADD THIS
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
                    formData.append('image_descriptions', image.description || "");  // ← ADD THIS
                });
            }


            // Update listing
            const { data } = await axiosReq.put(`/short-term-listings/${id}/`, formData);

            antMessage.success('Listing updated successfully!');
            window.scrollTo(0, 0);
            history.push(`/short-term-listings/${data.id}`);
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
        { title: t("admin.listingsForms.amenities"), icon: <CheckCircleOutlined /> },
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
                            <AgentOwner
                                listingData={listingData}
                                handleChange={handleChange}
                                handleShow={handleShow}
                                handleClose={handleClose}
                                show={show}
                                owners={owners}
                                errors={errors}
                            />
                            <CurrencyPrice
                                listingData={listingData}
                                handleChange={handleChange}
                                errors={errors}
                                t={t}
                            />

                            {errors?.title?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>{message}</Alert>
                            ))}

                            <Divider />

                            <Row className="justify-content-center">
                                <Col md={6}>
                                    <Form.Label>Title (English)</Form.Label>
                                    <Form.Control
                                        className={styles.Input}
                                        type="text"
                                        name="title"
                                        value={listingData.title || ""}
                                        onChange={handleChange}
                                    />
                                    <Form.Label>Τίτλος Ακινήτου (Ελληνικά)</Form.Label>
                                    <Form.Control
                                        className={styles.Input}
                                        type="text"
                                        name="title_gr"
                                        value={listingData.title_gr || ""}
                                        onChange={handleChange}
                                    />
                                    {errors?.title?.map((message, idx) => (
                                        <Alert className={styles.Input} variant="warning" key={idx}>
                                            {message}
                                        </Alert>
                                    ))}
                                </Col>
                            </Row>

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
                            <Title level={4}>Location Details</Title>
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

                    {/* Step 3: Property Details */}
                    {currentStep === 3 && (
                        <div>
                            <Title level={4}>Property Details</Title>
                            <ShortTermFields
                                listingData={listingData}
                                handleChange={handleChange}
                                errors={errors}
                                t={t}
                                renderTextField={renderTextField}
                            />
                        </div>
                    )}

                    {/* Step 4: Amenities */}
                    {currentStep === 4 && (
                        <div>
                            <Title level={4}>Amenities</Title>
                            <AmenitiesShortTerm
                                handleAmenityChange={handleAmenityChange}
                                selectedAmenities={selectedAmenities}
                            />
                            <Card
                                bordered={false}
                                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '24px' }}
                            >
                                <ApprovedFeatureCheckbox
                                    listingData={listingData}
                                    handleChange={handleChange}
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
                                <Descriptions.Item label={lng === "el" ? t("propertyDetails.rentalTitleGr") : t("propertyDetails.rentalTitle")}>
                                    {lng === "el" ? listingData.title_gr || '-' : listingData.title || '-'}
                                </Descriptions.Item>

                                <Descriptions.Item label={t("propertyDetails.price")}>
                                    {listingData.currency} {listingData.price || '-'}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(1)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.maxGuests")}>{listingData.max_guests || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.owner")}>{listingData.listing_owner || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.location")} span={2}>
                                    {t("regionOptions.region")}: {regionName}, {t("regionOptions.county")}: {countyName}, {t("regionOptions.municipality")}: {municipalityName || '-'}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(2)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("amenities.title")} span={2}>
                                    <Tag color="purple">{t("admin.listingsForms.selected")}: {selectedAmenities.length}</Tag>
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(4)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                    <Space>
                        {currentStep > 0 && <Button size="large" onClick={prevStep}>{t("admin.listingsForms.previous")}</Button>}
                        <Button size="large" icon={<CloseOutlined />} onClick={() => history.push(`/short-term-listings/${id}`)}>{t("admin.listingsForms.cancel")}</Button>
                    </Space>

                    {currentStep < 5 ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={nextStep}
                            style={{ backgroundColor: '#847c3d', borderColor: '#847c3d' }}
                        >
                            {t("admin.listingsForms.continue")}
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

export default AdminShortTermEditForm;