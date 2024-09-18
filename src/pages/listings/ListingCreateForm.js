import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import upload from "../../assets/upload.png";
import styles from "../../styles/ListingCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import { useRedirect } from "../../hooks/useRedirect";
import ListingTextFields from "../../components/createEditFormFields/ListingFormTextFields";
import useUserStatus from "../../hooks/useUserStatus";
import Forbidden403 from "../errors/Forbidden403";

function ListingCreateForm() {
  useRedirect("loggedOut");
  const userStatus = useUserStatus();
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [listingData, setListingData] = useState({
    type: "",
    sub_type: "",
    sale_type: "",
    price: "",
    currency: "",
    description: "",
    description_gr: "",
    address_number: "",
    address_street: "",
    address_street_gr: "",
    postcode: "",
    municipality: "",
    municipality_gr: "",
    county: "",
    county_gr: "",
    region: "",
    region_gr: "",
    floor_area: "",
    land_area: "",
    levels: "",
    bedrooms: "",
    wc: "",
    floor: "",
    kitchens: "",
    bathrooms: "",
    living_rooms: "",
    rooms: "",
    power_type: "",
    power_type_gr: "",
    heating_system: "",
    heating_system_gr: "",
    energy_class: "",
    floor_type: "",
    construction_year: "",
    availability: "",
    latitude: "0.0",
    longitude: "0.0",
    service_charge: "",
    renovation_year: "",
    opening_frames: "",
    type_of_glass: "",
    building_coefficient: "",
    cover_coefficient: "",
    length_of_facade: "",
    orientation: "",
    view: "",
    slope: "",
    zone: "",
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
  });

  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const history = useHistory();
  const [selectedImageIdx, setSelectedImageIdx] = useState(null);

  const handleChange = (e) => {
    setListingData({
      ...listingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmenityChange = (e) => {
    const value = e.target.value;
    setSelectedAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((amenity) => amenity !== value)
        : [...prev, value]
    );
  };

  const handleChangeImage = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(listingData.images);
      setListingData({
        ...listingData,
        images: URL.createObjectURL(e.target.files[0]),
      });
    }
  };


  const handleSelectedImage = (index) => {
    if (index !== null) {
      const imageIndex = index;
      setSelectedImageIdx(index);

      setListingData({
        ...listingData,
        is_first: imageIndex === "" || null ? "0" : imageIndex,
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

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
    formData.append("surface", listingData.floor_area || "0");
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
    formData.append("heating_system", listingData.heating_system);
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
    formData.append("approved", listingData.approved);
    formData.append("featured", listingData.featured);
    formData.append("is_first", listingData.is_first || "0");

    selectedAmenities.forEach((amenity) => {
      formData.append("amenities_ids", amenity);
    });

    formData.append("images", imageInput.current.files[0]);
    // Append the selected images to delete to the form data.
    if (imageInput.current.files.length > 0) {
      Array.from(imageInput.current.files).forEach((file) => {
        formData.append("uploaded_images", file);
      });
    } else {
      setErrors({ images: ["Please add an image"] });
    }

    try {
      const { data } = await axiosReq.post("/listings/", formData);
      history.push(`/listings/${data.id}`);
    } catch (err) {
      if (err.response?.status === 403) {
        history.push("/forbidden");
      } else {
        setErrors(err.response?.data);
      }
    }
  };

  if (userStatus === false) {
    return <Forbidden403 />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0">
          <Container className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
            <Form.Group className="text-center justify-content-between">
              {listingData.images ? (
                <>
                  <Row>
                    {Array.from(imageInput.current.files).map((file, idx) => (
                      <>
                        <Col md={3} key={file.id}>
                          <div
                            className={`my-2 ${styles.ImageWrapper} ${selectedImageIdx === idx ? styles.SelectedImage : ""}`}
                            onClick={() => handleSelectedImage(idx)}
                            style={{ cursor: 'pointer' }}>
                            <figure>
                              <Image
                                className={`"my-2 px-2" ${styles.Image}`}
                                src={URL.createObjectURL(file)}
                                rounded
                              />
                            </figure>

                            <Form.Check
                              type="radio"
                              id={`radio-${idx}`}
                              name="is_first"
                              value={listingData.is_first}
                              checked={selectedImageIdx === idx}
                              onChange={() => handleSelectedImage(idx)}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </Col>
                      </>
                    ))}
                  </Row>

                  <div>
                    <Form.Label className={`${btnStyles.Button} ${btnStyles.Bright} btn`} htmlFor="image-upload">
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label className="d-flex justify-content-center" htmlFor="image-upload">
                  <Asset src={upload} message="Click or tap to upload an image" />
                </Form.Label>
              )}

              <input
                type="file"
                multiple id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.images?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            {errors?.uploaded_images?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">
              <ListingTextFields
                listingData={listingData}
                handleChange={handleChange}
                history={history}
                errors={errors}
                create={true}
                handleAmenityChange={handleAmenityChange}
                selectedAmenities={selectedAmenities}
              />
            </div>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="d-none d-md-block p-0 p-md-2">
          <Container fluid className={appStyles.Content}>
            <ListingTextFields
              listingData={listingData}
              handleChange={handleChange}
              history={history}
              errors={errors}
              create={true}
              selectedAmenities={selectedAmenities}
              handleAmenityChange={handleAmenityChange}
            />
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default ListingCreateForm;
