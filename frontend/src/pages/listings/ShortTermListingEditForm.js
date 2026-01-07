import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal"

import styles from "../../styles/ListingCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import ListingTextFields from "../../components/createEditFormFields/ListingFormTextFields";
import useUserStatus from "../../hooks/useUserStatus";
import Forbidden403 from "../errors/Forbidden403";
import upload from "../../assets/upload.png";
import Asset from "../../components/Asset";

function ShortTermListingEditForm() {
  useRedirect("loggedOut");
  const [listingData, setListingData] = useState({
    price: "",
    currency: "",
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
    images: "",
    uploaded_images: [],
    amenities: [],
    approved: false,
    featured: false,
    region_id: "",
    county_id: "",
    municipality_id: "",
    listing_owner: "",
  });

  const [errors, setErrors] = useState({});
  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();
  const userStatus = useUserStatus();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [show, setShow] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    // Fetch the listing data from the API.
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/short-term-listings/${id}/`);
        const {
          type,
          sub_type,
          sale_type,
          price,
          currency,
          description,
          description_gr,
          address_number,
          address_street,
          address_street_gr,
          postcode,
          municipality,
          floor_area,
          levels,
          bedrooms,
          wc,
          floor,
          kitchens,
          bathrooms,
          living_rooms,
          latitude,
          longitude,
          distance_from_sea,
          distance_from_city,
          distance_from_airport,
          distance_from_village,
          distance_from_port,
          images,
          uploaded_images,
          amenities,
          approved,
          featured,
          region_id,
          county_id,
          municipality_id,
          listing_owner,
          max_guests,
          max_adults,
          max_children,
        } = data;


        // Set the listing data state to the fetched data.
        setListingData({
          type,
          sub_type,
          sale_type,
          price,
          currency,
          description,
          description_gr,
          address_number,
          address_street,
          address_street_gr,
          postcode,
          municipality,
          floor_area,
          levels,
          bedrooms,
          wc,
          floor,
          kitchens,
          bathrooms,
          living_rooms,
          latitude,
          longitude,
          distance_from_sea,
          distance_from_city,
          distance_from_airport,
          distance_from_village,
          distance_from_port,
          amenities,
          approved,
          featured,
          images,
          uploaded_images,
          region_id,
          county_id,
          municipality_id,
          listing_owner,
          max_guests,
          max_adults,
          max_children,
        });
        setSelectedAmenities(amenities.map((amenity) => amenity.id));

      } catch (err) {
        if (err.response.status === 403) {
          <Forbidden403 />;
        }
        // console.log(err);
      }
    };
    handleMount();
  }, [id, history]);



  // Function to handle the change event for the input fields.
  const handleChange = (e) => {
    setListingData({
      ...listingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAmenityChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((amenity) => amenity !== value)
        : [...prev, value]
    );
  };

  // Function to handle the change event for the image input field.
  const handleChangeImage = (e) => {
    if (e.target.files.length) {
      URL.revokeObjectURL(listingData.images);
      setListingData({
        ...listingData,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  // Function to handle the move image event.
  const handleMoveImage = (index, direction) => {
    const reorderedImages = Array.from(listingData.images);
    const movedImage = reorderedImages.splice(index, 1)[0];
    reorderedImages.splice(index + direction, 0, movedImage);

    setListingData({
      ...listingData,
      images: reorderedImages,
    });
  };


  // Function to handle the selected images to delete
  const handleSelectedImages = (e) => {
    // Get the checked checkboxes.
    const checkedBoxes = document.querySelectorAll(
      "input[name=images]:checked"
    );
    // If there are checked checkboxes, get their values and add them to the selected images state.
    if (checkedBoxes.length > 0) {
      const checkedValues = Array.from(checkedBoxes).map(
        (checkbox) => checkbox.value
      );

      setSelectedImages((prevSelectedImages) => {
        if (e.target.checked) {
          return [...prevSelectedImages, ...checkedValues];
        } else {
          return prevSelectedImages.filter(
            (image) => !checkedValues.includes(image)
          );
        }
      });
    } else {
      setSelectedImages([]);
    }
  };

  // Function to handle the delete image event.
  const handleDeleteImage = async (e) => {
    e.preventDefault();
    if (selectedImages.length === 0) {
      alert("No images selected for deletion.");
      return;
    }

    try {
      await axiosReq.delete(`/short-term-listings/${id}/images/`, {
        data: {
          image_ids: selectedImages, // Send all selected image IDs for bulk deletion
        },
      });

      setSelectedImages([]);  // Clear the selected images state
      window.location.reload();  // Reload the page to reflect the deleted images
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  // Function to get the selected image index.
  const handleSelectedImage = (index) => {
    if (index !== null) {
      const imageIndex = index;
      setSelectedImageIdx(index);

      setListingData({
        ...listingData,
        is_first: imageIndex === "" || null ? 0 : imageIndex,
      });
    }
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

  // Function to handle the submit event for the form.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
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
    formData.append("amenities", listingData.amenities);
    formData.append("approved", listingData.approved);
    formData.append("featured", listingData.featured);
    formData.append("is_first", listingData.is_first || "0");
    formData.append("region_id", listingData.region_id);
    formData.append("county_id", listingData.county_id);
    formData.append("municipality_id", listingData.municipality_id);
    formData.append("listing_owner", listingData.listing_owner || "");
    formData.append("max_guests", listingData.max_guests || "0");
    formData.append("max_adults", listingData.max_adults || "0");
    formData.append("max_children", listingData.max_children || "0");

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
    const reorderedImageIds = listingData.images.map((image) => image.id);

    try {
      await axiosReq.put(`/short-term-listings/${id}/images/reorder-images/`, {
        reordered_image_ids: reorderedImageIds,
      });
      // Send a PUT request to the API to edit the listing.
      const { data } = await axiosReq.put(`/short-term-listings/${id}/`, formData);
      // Redirect to the listing page for the edited listing.
      window.scrollTo(0, 0);
      window.localStorage.setItem("edited", true);
      history.push(`/short-term-listings/${data.id}`);
    } catch (err) {
      setErrors(err.response?.data);
      window.scrollTo(0, 0);
      if (err.response?.status === 403) {
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
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center justify-content-between">
              <Alert
                variant="danger"
                className={`${btnStyles.Wide} mx-auto`}
              >
                To delete images choose the ones you would like to delete
                and press the button below
              </Alert>
              <div>
                {Array.from(listingData.images).map((image, idx) => (
                  <figure key={image.id} className="border border-dark p-2 mx-1">

                    <Image
                      className={`"my-2 px-2" ${styles.Image}`}
                      src={image.url}
                      rounded
                    />
                    <div className="d-flex justify-content-between px-2 mt-1">
                      <input
                        type="number"
                        min="1"
                        max={listingData.images.length}
                        value={idx + 1}
                        onChange={(e) => handleMoveImage(idx, parseInt(e.target.value) - (idx + 1))}
                      />
                      <input
                        type="checkbox"
                        name="images"
                        value={image.id}
                        id={image.url}
                        onChange={handleSelectedImages}
                      />
                    </div>
                  </figure>
                ))}
              </div>
              <button className={`${btnStyles.Button} ${btnStyles.AngryOcean} m-3`} type="submit">
                Save order
              </button>
              <button
                className={`${btnStyles.Button} ${btnStyles.Remove} mb-1`}
                onClick={handleDeleteImage}
              >
                Delete selected image(s)
              </button>
              <Modal
                show={show}
                onHide={handleClose}
                dialogClassName={`${styles.Modal}`}
                centered
              >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <Row>
                    <div>
                      <p>
                        Are you sure you want to delete the selected image(s)?
                      </p>
                    </div>

                    <button
                      className={`${btnStyles.Button} ${btnStyles.Remove} mb-1`}
                      onClick={handleShow}
                    >
                      Delete selected image(s)
                    </button>

                  </Row>
                </Modal.Body>
              </Modal>
              <div>
                {imageInput.current &&
                  <Row>
                    {Array.from(imageInput.current.files).map((file, idx) => (
                      <>
                        <Col md={3} key={file.id}>
                          <div
                            className={`my- ${styles.ImageWrapper} ${selectedImageIdx === idx ? styles.SelectedImage : ""}`}
                            onClick={() => handleSelectedImage(idx)}
                            style={{ cursor: 'pointer' }}>
                            <figure>
                              <Image
                                className={`my-2 px-2 ${styles.Image}`}
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
                }
                <Form.Label
                  htmlFor="image-upload"
                  className={styles.ImageUpload}
                >
                  <Asset src={upload} message="Click or tap to upload an image" />
                </Form.Label>
              </div>
              <input
                type="file"
                multiple
                id="image-upload"
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
                errors={errors}
                handleAmenityChange={handleAmenityChange}
                selectedAmenities={selectedAmenities}
                edit={true}
                onRegionChange={handleRegionChange}
                onCountyChange={handleCountyChange}
                onMunicipalityChange={handleMunicipalityChange}
                selectedRegion={selectedRegion}
                selectedCounty={selectedCounty}
                selectedMunicipality={selectedMunicipality}
                history={history}
              />
            </div>
          </Container>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>
            <ListingTextFields
              listingData={listingData}
              handleChange={handleChange}
              errors={errors}
              handleAmenityChange={handleAmenityChange}
              selectedAmenities={selectedAmenities}
              edit={true}
              onRegionChange={handleRegionChange}
              onCountyChange={handleCountyChange}
              onMunicipalityChange={handleMunicipalityChange}
              selectedRegion={selectedRegion}
              selectedCounty={selectedCounty}
              selectedMunicipality={selectedMunicipality}
              history={history}
            />
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default ShortTermListingEditForm;