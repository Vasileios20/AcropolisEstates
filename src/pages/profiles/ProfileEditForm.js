import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { axiosReq } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const ProfileEditForm = () => {
  /**
   * The ProfileEditForm component is a functional component that renders a form for editing the user's profile.
   * It fetches the user's profile data from the API and updates the user's profile data.
   * @returns {JSX.Element} - The JSX for the component.
   */

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const imageFile = useRef();
  const profileDataSet = useRef(false);

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    image: "",
    phone: "",
  });
  const { first_name, last_name, email_address, image, phone } = profileData;

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleMount = async () => {
      // redirect user if they are not the owner of this profile
      if (currentUser?.profile_id?.toString() === id) {
        try {
          // fetch the user's profile data from the API
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { first_name, last_name, email_address, image, phone } = data;
          // set the profile data state if it has not been set
          if (!profileDataSet.current) {
            setProfileData({
              first_name,
              last_name,
              email_address,
              image,
              phone,
            });
            profileDataSet.current = true;
          }
        } catch (err) {
          // console.log(err);
          history.push("/");
        }
      } else {
        history.push("/");
      }
    };

    handleMount();
  }, [history, id, currentUser]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email_address", email_address);
    formData.append("phone", phone);
    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        profile_image: data.image,
      }));
      history.goBack();
    } catch (err) {
      // console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={first_name}
          onChange={handleChange}
          name="first_name"
        />
      </Form.Group>
      {errors?.first_name?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={last_name}
          onChange={handleChange}
          name="last_name"
        />
      </Form.Group>
      {errors?.last_name?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          value={email_address}
          onChange={handleChange}
          name="email_address"
        />
      </Form.Group>
      {errors?.email_address?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          value={phone}
          onChange={handleChange}
          name="phone"
        />
      </Form.Group>
      {errors?.phone?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}. The format should be +CC MMMM MMMM. For example, +44 1234
          567890.
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Bright} m-3`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Bright}`}
        type="submit"
      >
        save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row style={{ marginTop: "8rem" }}>
        <Col className="py-2 p-0 p-md-2 text-center" md={7} lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              {image && (
                <figure>
                  <Image src={image} fluid />
                </figure>
              )}
              {errors?.image?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Bright} btn my-auto mb-5`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>
              <input
                type="file"
                id="image-upload"
                ref={imageFile}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length) {
                    setProfileData({
                      ...profileData,
                      image: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={6} className="d-none d-md-block p-0 p-md-2 text-center">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;
