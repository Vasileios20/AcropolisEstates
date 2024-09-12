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
    amenities: [],
    approved: false,
    featured: false,
  });

  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const history = useHistory();

  const handleChange = (e) => {
    setListingData({
      ...listingData,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(listingData).forEach((key) => {
      if (key === "uploaded_images") {
        Array.from(imageInput.current.files).forEach((file) => {
          formData.append("uploaded_images", file);
        });
      } else {
        formData.append(key, listingData[key]);
      }
    });

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
                  {Array.from(imageInput.current.files).map((file, idx) => (
                    <figure key={idx}>
                      <Image className={`"my-2 px-2" ${styles.Image}`} src={URL.createObjectURL(file)} rounded />
                    </figure>
                  ))}

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

              <input type="file" multiple id="image-upload" accept="image/*" onChange={handleChangeImage} ref={imageInput} />
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
              <ListingTextFields listingData={listingData} handleChange={handleChange} history={history} errors={errors} create={true} />
            </div>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="d-none d-md-block p-0 p-md-2">
          <Container fluid className={appStyles.Content}>
            <ListingTextFields listingData={listingData} handleChange={handleChange} history={history} errors={errors} create={true} />
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default ListingCreateForm;
