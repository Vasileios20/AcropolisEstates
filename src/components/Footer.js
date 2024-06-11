import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useHistory } from "react-router-dom";

import styles from "../styles/Footer.module.css";
import { axiosReq } from "../api/axiosDefaults";
import { Form } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { useEffect } from "react";

const Footer = () => {
  /**
   * The Footer component is a functional component that renders the footer of the application.
   */

  const history = useHistory();
  const { t, i18n } = useTranslation();

  const lng = navigator.language || navigator.userLanguage;

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [i18n, lng]);

  const handleSubmit = async (selectedType) => {
    // Fetch the listings from the API using the search parameters.
    let path = `/listings/?type=${selectedType}`;

    try {
      const { data } = await axiosReq.get(`${path}`);
      console.log(path);
      console.log("data", data);
      history.push(`${path}`, { data: data });
    } catch (err) {
      // console.log(err);
      if (err.response.status === 400) {
      }
    }
  };

  return (
    <Container fluid className={`${styles.Footer}`}>
      <Container>
        <Row className="pt-3 justify-content-between">
          <Col sm={3} className="d-flex flex-column">
            <h5>Acropolis Estates</h5>
            <Link to="/about" className={`${styles.link}`}>
              {t("footer.about")}
            </Link>
            {/* <Link to="/faq" className={`${styles.link} `}>
              FAQ
            </Link> */}
            <div className={styles.Social}>
              <a href="https://www.facebook.com/profile.php?id=100063495071258" target="_blank"
                aria-label="Visit our Facebook page" rel="noreferrer"><i className="fa-brands fa-facebook"></i></a>
              <a href="https://www.instagram.com/acropolis_estates/" target="_blank" aria-label="Visit our Instagram page" rel="noreferrer"><i
                className="fa-brands fa-instagram"></i></a>
              <a href="https://www.linkedin.com/company/acropolis-estates/about/?viewAsMember=true" target="_blank" aria-label="Visit our LinkedIn page" rel="noreferrer"><i
                className="fa-brands fa-linkedin"></i></a>
            </div>
          </Col>

          <Col sm={3} className={`d-flex flex-column ${styles.MobileMarginTop}`}>
            <h5>{t("footer.properties")}</h5>
            <Form.Label
              className={`${styles.link}`}
              onClick={() => handleSubmit("residential")}
            >
              {t("listingType.residential")}
            </Form.Label>

            <Form.Label
              className={`${styles.link}`}
              onClick={() => handleSubmit("land")}
            >
              {t("listingType.land")}
            </Form.Label>

            <Form.Label
              className={`${styles.link}`}
              onClick={() => handleSubmit("commercial")}
            >
              {t("listingType.commercial")}
            </Form.Label>


          </Col>
          <Col sm={3} className={`${styles.MobileMarginTop}`}>
            <h5 className="">{t("footer.contact.title")}</h5>
            <div className="">

              <p className="m-0">
                {t("footer.contact.address")}
              </p>
              <p className="m-0">
                <Trans i18nKey="footer.contact.email" components={{
                  1: <Link to="/contact" className={`${styles.link}`} />
                }} />
              </p>
              <p className="m-0">
                {t("footer.contact.phone")}
              </p>
            </div>
          </Col>

        </Row>
        <Row className={`text-center mt-2 align-items-center`}>
          <hr />
          <Col sm={4}>
            <p className="text-muted">
              &copy; {new Date().getFullYear()} {t("footer.copyRight")}
            </p>
          </Col>
          <Col sm={4}>
            <p className="text-muted">
              <Link to="/cookies" className={`${styles.link}`}>Cookies </Link> | <Link to="/privacyPolicy" className={`${styles.link}`}>{t("footer.privacyPolicy")}</Link> | <Link to="/terms" className={`${styles.link}`}>{t("footer.terms")}</Link>
            </p>
          </Col>
          <Col sm={4}>
            <>
              <p className="text-muted">Developed by <a href="https://www.linkedin.com/in/vasileios-tsimourdagkas/" target="_blank" rel="noreferrer" className={`${styles.link}`}>VasileiosT</a>
              </p>
            </>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Footer;
