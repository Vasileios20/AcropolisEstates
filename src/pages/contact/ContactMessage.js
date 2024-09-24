import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import styles from "../../styles/ContactForm.module.css";

const ContactMessage = () => {
  /**
   * The ContactMessage component is a functional component that renders a single message from the contact list.
   * It fetches the message from the API using the id from the URL.
   * @returns {JSX.Element} - The JSX for the component.
   */

  const [message, setMessage] = useState("");
  const history = useHistory();
  const { id } = useParams();

  // Fetch the message from the API.
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { data } = await axiosReq.get(`/contact_list/${id}/`);
        setMessage(data);
      } catch (err) {
        // console.log(err);
        if (err.response.status === 403) {
          history.push("/forbidden");
        }
      }
    };

    fetchMessage();
  }, [history, id]);

  return (
    <Row className={styles.FormMargin}>
      <Col>
        <Card>
          <Card.Header>
            <h1 className="pb-2">
              Message from: <strong>{message.name}</strong>
            </h1>
          </Card.Header>
          <Card.Body>
            <Card.Title>Email address: {message.email}</Card.Title>
            <Card.Title>Subject: {message.subject}</Card.Title>
            <Card.Title>Message:</Card.Title>
            <Card.Text>{message.message}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ContactMessage;
