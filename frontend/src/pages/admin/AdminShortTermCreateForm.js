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
import Description from "../../components/createEditFormFields/Description";
import LocationFields from "../../components/createEditFormFields/LocationFields";
import DragDropImageUpload from "components/DragDropImageUpload";
import { useTranslation } from "react-i18next";

import Form from "react-bootstrap/Form";
import styles from "../../styles/ListingCreateEditForm.module.css";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ShortTermFields from "components/createEditFormFields/ShortTermFields";
import AgentOwner from "components/createEditFormFields/Owner";
import CurrencyPrice from "components/createEditFormFields/CurrencyPriceAvailability";
import AmenitiesShortTerm from "components/createEditFormFields/amenities/AmenitiesShortTerm";
import { App } from 'antd';
import useFetchLocationData from "hooks/useFetchLocationData";
import { ApprovedFeatureCheckbox } from "components/createEditFormFields/ApprovedFeatureCheckbox";

const { Title } = Typography;

function AdminShortTermListingCreateForm() {
    useRedirect("loggedOut");
    const userStatus = useUserStatus();
    const { owners, hasLoaded: ownersLoaded } = useFetchOwners();
    const history = useHistory();
    const { message: antMessage } = App.useApp();
    const { t, i18n } = useTranslation();
    const lng = i18n?.language;

    const owner = owners.reduce((map, owner) => {
        map[owner.id] = `${owner.first_name} ${owner.last_name}`;
        return map;
    }, {});

    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const { regionsData } = useFetchLocationData();

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
        title: "",
        title_gr: "",
        currency: "",
        description: "",
        description_gr: "",
        address_number: "",
        address_street: "",
        address_street_gr: "",
        postcode: "",
        municipality: "",
        municipality_gr: "",
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
        images: "",
        uploaded_images: [],
        approved: false,
        featured: false,
        is_first: "",
        region_id: "",
        county_id: "",
        municipality_id: "",
        listing_owner: "",
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [errors, setErrors] = useState({});

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
                if (!listingData.price) newErrors.price = [t("admin.listingsForms.stepErrors.priceIsRequired")];
                if (!listingData.listing_owner) newErrors.listing_owner = [t("admin.listingsForms.stepErrors.ownerIsRequired")];
                if (!listingData.title) newErrors.title = [t("admin.listingsForms.stepErrors.titleIsRequired")];
                if (!listingData.title_gr) newErrors.title_gr = [t("admin.listingsForms.stepErrors.titleIsRequiredGr")];
                if (!listingData.description) newErrors.description = [t("admin.listingsForms.stepErrors.descriptionIsRequired")];
                if (!listingData.description_gr) newErrors.description_gr = [t("admin.listingsForms.stepErrors.descriptionIsRequiredGr")];
                break;
            case 2:
                if (!listingData.region_id) newErrors.region_id = [t("admin.listingsForms.stepErrors.regionIsRequired")];
                if (!listingData.county_id) newErrors.county_id = [t("admin.listingsForms.stepErrors.countyIsRequired")];
                if (!listingData.municipality_id) newErrors.municipality_id = [t("admin.listingsForms.stepErrors.municipalityIsRequired")];
                if (!listingData.latitude || listingData.latitude === "0.0") newErrors.latitude = [t("admin.listingsForms.stepErrors.latitudeIsRequired")];
                if (!listingData.longitude || listingData.longitude === "0.0") newErrors.longitude = [t("admin.listingsForms.stepErrors.longitudeIsRequired")];
                break;
            case 3:
                if (!listingData.max_guests) newErrors.max_guests = [t("admin.listingsForms.stepErrors.maxGuestsIsRequired")];
                if (!listingData.max_adults) newErrors.max_adults = [t("admin.listingsForms.stepErrors.maxAdultsIsRequired")];
                if (!listingData.max_children) newErrors.max_children = [t("admin.listingsForms.stepErrors.maxChildrenIsRequired")];
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

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const formData = new FormData();

        formData.append("price", listingData.price || "0");
        formData.append("title", listingData.title || "");
        formData.append("title_gr", listingData.title_gr || "");
        formData.append("currency", listingData.currency);
        formData.append("description", listingData.description);
        formData.append("description_gr", listingData.description_gr);
        formData.append("address_number", listingData.address_number || "0");
        formData.append("address_street", listingData.address_street);
        formData.append("address_street_gr", listingData.address_street_gr);
        formData.append("postcode", listingData.postcode);
        formData.append("municipality", listingData.municipality);
        formData.append("floor_area", listingData.floor_area || "0");
        formData.append("bedrooms", listingData.bedrooms || "0");
        formData.append("wc", listingData.wc || "0");
        formData.append("floor", listingData.floor || "0");
        formData.append("kitchens", listingData.kitchens || "0");
        formData.append("bathrooms", listingData.bathrooms || "0");
        formData.append("living_rooms", listingData.living_rooms || "0");
        formData.append("latitude", listingData.latitude || "0.0");
        formData.append("longitude", listingData.longitude || "0.0");
        formData.append("distance_from_sea", listingData.distance_from_sea || "0");
        formData.append("distance_from_city", listingData.distance_from_city || "0");
        formData.append("distance_from_airport", listingData.distance_from_airport || "0");
        formData.append("distance_from_village", listingData.distance_from_village || "0");
        formData.append("distance_from_port", listingData.distance_from_port || "0");
        formData.append("approved", listingData.approved);
        formData.append("featured", listingData.featured);
        formData.append("is_first", listingData.is_first || "0");
        formData.append("region_id", listingData.region_id);
        formData.append("county_id", listingData.county_id);
        formData.append("municipality_id", listingData.municipality_id);
        formData.append("listing_owner", listingData.listing_owner);
        formData.append("max_guests", listingData.max_guests || "0");
        formData.append("max_adults", listingData.max_adults || "0");
        formData.append("max_children", listingData.max_children || "0");

        selectedAmenities.forEach((amenity) => {
            formData.append("amenities_ids", parseInt(amenity, 10));
        });

        // Append image files with order
        uploadedImages.forEach((image) => {
            formData.append("uploaded_images", image.file);
            formData.append("image_orders", image.order);
        });

        try {
            const { data } = await axiosReq.post("/short-term-listings/", formData);
            antMessage.success('Listing created successfully!');
            history.push(`/short-term-listings/${data.id}`);
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
        { title: t("admin.listingsForms.amenities"), icon: <ToolOutlined /> },
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
                    {t("admin.listingsForms.createNewRental")}
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
                            <Title level={4}>{t("admin.listingsForms.uploadPropertyImages")}</Title>
                            <DragDropImageUpload
                                uploadedImages={uploadedImages}
                                setUploadedImages={setUploadedImages}
                                error={errors?.images}
                                maxImages={40}
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
                                handleShow={handleShow}
                                handleClose={handleClose}
                                show={show}
                                owners={owners}
                                errors={errors}
                                t={t}
                            />

                            <hr />
                            <Row className="justify-content-center">
                                <Col md={6}>
                                    <Form.Label>{t("propertyDetails.rentalTitle")}</Form.Label>
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
                                handleShow={handleShow}
                                handleClose={handleClose}
                                show={show}
                                owners={owners}
                                errors={errors}
                                t={t}
                            />
                        </div>
                    )}

                    {/* Step 2: Location */}
                    {currentStep === 2 && (
                        <div>
                            <Title level={4}>{t("admin.listingsForms.location")}</Title>
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

                    {/* Step 3: Max Guests and Occupancy, Technical Details */}
                    {currentStep === 3 && (
                        <ShortTermFields
                            listingData={listingData}
                            handleChange={handleChange}
                            handleShow={handleShow}
                            handleClose={handleClose}
                            show={show}
                            owners={owners}
                            errors={errors}
                            t={t}
                            renderTextField={renderTextField}
                            handleAmenityChange={handleAmenityChange}
                            selectedAmenities={selectedAmenities}
                        />
                    )}

                    {/* Step 4: Amenities */}
                    {currentStep === 4 && (
                        <>
                            <Row className="justify-content-center mt-4">
                                <AmenitiesShortTerm
                                    handleAmenityChange={handleAmenityChange}
                                    selectedAmenities={selectedAmenities}

                                />
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
                            </Row>
                        </>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div>
                            <Title level={4} style={{ textAlign: 'center' }}>✅ {t("admin.listingsForms.review")}</Title>
                            <Descriptions bordered column={2} style={{ marginTop: '24px' }}>
                                <Descriptions.Item label={t("admin.listingsForms.images")} span={2}>
                                    <Tag color="blue">{uploadedImages.length} {t("admin.listingsForms.images")}</Tag>
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(0)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.rentalTitle")}>{listingData.title || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.rentalTitleGr")}>{listingData.title_gr || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.price")}>
                                    {listingData.currency} {listingData.price || '-'}
                                    <Button type="link" size="small" icon={<EditOutlined />} onClick={() => goToStep(1)}>{t("admin.listingsForms.edit")}</Button>
                                </Descriptions.Item>

                                <Descriptions.Item label={t("propertyDetails.owner")}>{owner[listingData.listing_owner] || '-'}</Descriptions.Item>
                                <Descriptions.Item label={t("propertyDetails.maxGuests")} span={1}>{listingData.max_guests || '-'}</Descriptions.Item>
                                <Descriptions.Item label={`${t("propertyDetails.maxAdults")} | ${t("propertyDetails.maxChildren")}`} span={1}>{listingData.max_adults || '-'} | {listingData.max_children || '-'}</Descriptions.Item>

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
                        <Button size="large" icon={<CloseOutlined />} onClick={() => history.push('/frontend/admin/short-term-listings')}>{t("admin.listingsForms.cancel")}</Button>
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
                            {t("admin.listingsForms.submit")}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default AdminShortTermListingCreateForm;