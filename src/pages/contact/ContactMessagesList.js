import { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/ContactForm.module.css";
import { Link, useHistory } from "react-router-dom";
import useUserStatus from "../../hooks/useUserStatus";
import Forbidden403 from "../errors/Forbidden403";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";

const ContactMessagesList = () => {
  /**
   * The ContactMessagesList component is a functional component that renders a list of messages from the contact form.
   * It fetches the messages from the API and displays them in a table.
   * It also contains a search form to filter the messages by name, email, subject, and date.
   * @returns {JSX.Element} - The JSX for the component.
   */

  const status = useUserStatus();
  const [contactList, setContactList] = useState({ results: [] });
  const [query, setQuery] = useState("");
  const [created_at, setCreated_at] = useState({ min: "", max: "" });
  const history = useHistory();
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      To search for a specific day, select only the "Date from" field.
    </Tooltip>
  );

  useEffect(() => {
    // Fetch the messages from the API.
    const fetchContactList = async () => {
      try {
        const { data } = await axiosReq.get("/contact_list");
        setContactList(data);
      } catch (err) {
        // console.log(err);
        if (err.response.status === 403) {
          history.push("/forbidden");
        }
      }
    };
    fetchContactList();
  }, [history]);

  // Submit the search form.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fetch the messages from the API using the search parameters.
    let path = `/contact_list/?`;
    if (query) {
      path += `&search=${query}`;
    }
    if (created_at.min) {
      path += `&min_created_at=${created_at.min}`;
    }
    if (created_at.max) {
      path += `&max_created_at=${created_at.max}`;
    }
    if (created_at.min && !created_at.max) {
      const date = new Date(created_at.min);
      date.setDate(date.getDate() + 1);
      const nextDay = date.toISOString().split("T")[0];
      path += `&max_created_at=${nextDay}`;
    }
    try {
      const { data } = await axiosReq.get(`${path}`);
      setContactList(data);
    } catch (err) {
      // console.log(err);
      if (err.response.status === 403) {
        history.push("/forbidden");
      }
    }
  };

  return (
    <>
      {status ? (
        <>
          <Form
            className={`d-flex justify-content-center border p-4 bg-light ${styles.FormMargin}`}
            onSubmit={handleSubmit}
          >
            <Row>
              <Col md={4} className="mt-auto">
                <Form.Control
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="name, email or subject"
                />
              </Col>

              <Col md={4}>
                <Form.Label>
                  Date from
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <span style={{ cursor: "pointer" }}> *</span>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Min"
                  min="0"
                  value={created_at.min}
                  onChange={(e) =>
                    setCreated_at({ ...created_at, min: e.target.value })
                  }
                />
              </Col>

              <Col md={4}>
                <Form.Label>Date to</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Max"
                  min={created_at.min}
                  max="10000000"
                  value={created_at.max}
                  onChange={(e) =>
                    setCreated_at({ ...created_at, max: e.target.value })
                  }
                />
              </Col>

              <Col className="d-flex">
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Bright} mt-2 ml-auto`}
                  type="submit"
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>

          <Row>
            <Col className="text-center mt-3">
              <h1>Messages</h1>
            </Col>
          </Row>
          <Row
            className="mt-2"
            id="scrollableDiv"
            style={{
              height: 500,
              overflow: "auto",
              marginTop: "20px",
            }}
          >
            <Col>
              <InfiniteScroll
                dataLength={contactList.results.length}
                next={() => fetchMoreData(contactList, setContactList)}
                hasMore={contactList.next}
                loader={<Asset spinner />}
                scrollableTarget="scrollableDiv"
              >
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactList.results.map((contact, idx) => (
                      <tr key={idx}>
                        <td>
                          <Link to={`/contact_list/${contact.id}`}>
                            {contact.first_name} {contact.last_name}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/contact_list/${contact.id}`}>
                            {contact.email}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/contact_list/${contact.id}`}>
                            {contact.subject.slice(0, 30)}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/contact_list/${contact.id}`}>
                            {contact.message.slice(0, 30)}...
                          </Link>
                        </td>
                        <td>
                          <Link to={`/contact_list/${contact.id}`}>
                            {contact.created_at}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </InfiniteScroll>
            </Col>
          </Row>
        </>
      ) : (
        <Forbidden403 />
      )}
    </>
  );
};

export default ContactMessagesList;
