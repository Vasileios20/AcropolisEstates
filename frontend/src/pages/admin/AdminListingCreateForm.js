import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
    Steps,
    Card,
    Button,
    Space,
    Typography,
    Descriptions,
    Tag,
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
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import useUserStatus from "../../hooks/useUserStatus";
import useFetchOwners from "../../hooks/useFetchOwners";
import Forbidden403 from "../errors/Forbidden403";
import DragDropImageUpload from "../../components/DragDropImageUpload";
import TypeSaleSub from "../../components/createEditFormFields/TypeSaleSub";
import CurrencyPriceAvailability from "../../components/createEditFormFields/CurrencyPriceAvailability";
import Description from "../../components/createEditFormFields/Description";
import LocationFields from "../../components/createEditFormFields/LocationFields";
import ResidentialFields from "../../components/createEditFormFields/ResidentialFields";
import CommercialFields from "../../components/createEditFormFields/CommercialFields";
import LandFields from "../../components/createEditFormFields/LandFields";
import { useTranslation } from "react-i18next";
import Owner from "../../components/createEditFormFields/Owner";
import Form from "react-bootstrap/Form";
import styles from "../../styles/ListingCreateEditForm.module.css";
import { Alert } from "react-bootstrap";
import { App } from 'antd';
import useFetchLocationData from "hooks/useFetchLocationData";
import { AmenitiesLand } from "components/createEditFormFields/amenities/AmenitiesLand";
import { AmenitiesResidential } from "components/createEditFormFields/amenities/AmenitiesResidential";
import { AmenitiesCommercial } from "components/createEditFormFields/amenities/AmenitiesCommercial";
import { ApprovedFeatureCheckbox } from "components/createEditFormFields/ApprovedFeatureCheckbox";

const { Title } = Typography;

function AdminListingCreateForm() {
    // Authentication and authorization hooks
    useRedirect("loggedOut");
    const userStatus = useUserStatus();

    // Translation and routing
    const { t, i18n } = useTranslation();
    const lng = i18n?.language;
    const history = useHistory();

    const { message: antMessage } = App.useApp();
    // Modal state for Owner creation
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    // Fetch owners data
    const { owners, hasLoaded: ownersLoaded } = useFetchOwners();

    // Location data
    const { regionsData } = useFetchLocationData();

    // Form state

    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleChange = (e) => {
        setListingData({
            ...listingData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAmenityChange = (amenityId) => {
        setSelectedAmenities((prev) =>
            prev.includes(amenityId)
                ? prev.filter((id) => id !== amenityId)
                : [...prev, amenityId]
        );
    };

    const handleRegionChange = (region) => {
        setSelectedRegion(region);
        setListingData((prevData) => ({
            ...prevData,
            region_id: region,
        }));
        setSelectedCounty("");
        setSelectedMunicipality("");
    };

    const handleCountyChange = (county) => {
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
                break;
            case 1:
                if (!listingData.type) newErrors.type = ["Type is required"];
                if (!listingData.sale_type) newErrors.sale_type = ["Sale type is required"];
                if (!listingData.price) newErrors.price = ["Price is required"];
                if (!listingData.listing_owner) newErrors.listing_owner = ["Owner is required"];
                break;
            case 2:
                if (!listingData.region_id) newErrors.region_id = ["Region is required"];
                if (!listingData.county_id) newErrors.county_id = ["County is required"];
                if (!listingData.municipality_id) newErrors.municipality_id = ["Municipality is required"];
                break;
            case 3:
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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append("type", listingData.type);
        formData.append("sub_type", listingData.sub_type || "");
        formData.append("sale_type", listingData.sale_type);
        formData.append("price", listingData.price || "0");
        formData.append("currency", listingData.currency);
        formData.append("description", listingData.description || "");
        formData.append("description_gr", listingData.description_gr || "");
        formData.append("address_number", listingData.address_number || "0");
        formData.append("address_street", listingData.address_street || "");
        formData.append("address_street_gr", listingData.address_street_gr || "");
        formData.append("postcode", listingData.postcode || "");
        formData.append("floor_area", listingData.floor_area || "0");
        formData.append("land_area", listingData.land_area || "0");
        formData.append("levels", listingData.levels || "0");
        formData.append("bedrooms", listingData.bedrooms || "0");
        formData.append("wc", listingData.wc || "0");
        formData.append("floor", listingData.floor || "0");
        formData.append("kitchens", listingData.kitchens || "0");
        formData.append("bathrooms", listingData.bathrooms || "0");
        formData.append("living_rooms", listingData.living_rooms || "0");
        formData.append("heating_system", listingData.heating_system || "");
        formData.append("energy_class", listingData.energy_class || "");
        formData.append("power_type", listingData.power_type || "");
        formData.append("floor_type", listingData.floor_type || "");
        formData.append("construction_year", listingData.construction_year || "");
        formData.append("latitude", listingData.latitude);
        formData.append("longitude", listingData.longitude);
        formData.append("cover_coefficient", listingData.cover_coefficient || "0");
        formData.append("building_coefficient", listingData.building_coefficient || "0");
        formData.append("length_of_facade", listingData.length_of_facade || "0");
        formData.append("orientation", listingData.orientation || "");
        formData.append("view", listingData.view || "");
        formData.append("slope", listingData.slope || "");
        formData.append("zone", listingData.zone || "");
        formData.append("distance_from_sea", listingData.distance_from_sea || "0");
        formData.append("rooms", listingData.rooms || "0");
        formData.append("approved", listingData.approved);
        formData.append("featured", listingData.featured);
        formData.append("is_first", "0");
        formData.append("region_id", listingData.region_id);
        formData.append("county_id", listingData.county_id);
        formData.append("municipality_id", listingData.municipality_id);
        formData.append("listing_owner", listingData.listing_owner);

        selectedAmenities.forEach((amenity) => {
            formData.append("amenities_ids", parseInt(amenity, 10));
        });

        if (uploadedImages.length > 0) {
            uploadedImages.forEach((image) => {
                formData.append('uploaded_images', image.file);
                formData.append('image_orders', image.order);
                formData.append('image_descriptions', image.description || "");
            });
        }

        try {
            const { data } = await axiosReq.post("/listings/", formData);
            antMessage.success('Listing created successfully!');
            history.push(`/listings/${data.id}`);
        } catch (err) {
            setErrors(err.response?.data || {});
            antMessage.error('Failed to create listing. Please check the form.');
            setIsSubmitting(false);
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

    if (!ownersLoaded) {
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
                    {t("admin.listingsForms.addListing")}
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
                            <Title level={4}>{t("admin.listingsForms.uploadImages")}</Title>
                            <DragDropImageUpload
                                uploadedImages={uploadedImages}
                                setUploadedImages={setUploadedImages}
                                error={errors?.images}
                                maxImages={20}
                                setExistingImages={setExistingImages}
                                existingImages={existingImages}
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
                                owners={owners}
                                errors={errors}
                                show={show}
                                handleShow={handleShow}
                                handleClose={handleClose}
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

                    {/* Step 3: Technical Details */}
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
                            <Title level={4} style={{ textAlign: 'center' }}>{t("admin.listingsForms.reviewYourListing")}</Title>
                            <Descriptions bordered column={2} style={{ marginTop: '24px' }}>
                                <Descriptions.Item label={t("admin.listingsForms.images")} span={2}>
                                    <Tag color="blue">{uploadedImages.length} images</Tag>
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(0)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.type")}>{listingData.type || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.typeSale")}>{listingData.sale_type || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.price")}>
                                    {listingData.currency} {listingData.price || '-'}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(1)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.owner")}>{listingData.listing_owner || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.location")} span={2}>
                                    {t("propertyDetails.region")}: {regionName}, {t("regionOptions.county")}: {countyName}, {t("regionOptions.municipality")}: {municipalityName || '-'}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(2)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("amenities.title")} span={2}>
                                    <Tag color="purple">{selectedAmenities.length} selected</Tag>
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
                        <Button size="large" icon={<CloseOutlined />} onClick={() => history.push('/frontend/admin/listings')}>{t("admin.listingsForms.cancel")}</Button>
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
                            {t("admin.listingsForms.submitListing")}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default AdminListingCreateForm;