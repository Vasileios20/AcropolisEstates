import React from "react";
import ContactForm from "./ContactForm";
import styles from "../../styles/ServicesPages.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("contactFormPage.title")}</title>
        <meta name="description" content="Contact us to learn more about our real estate advisory services and how we can assist you in achieving your real estate goals." />
        <meta name="keywords" content="acropolis estates, real estate advisory, real estate guidance, strategic advice, real estate investments, market analysis, property values, investment opportunities, financial planning, budgeting, cash flow analysis, risk assessment, market volatility, regulatory changes, property inspections, title searches, environmental assessments, due diligence, portfolio optimization, investment diversification, tax planning, tax-efficient investment, financing assistance, real estate financing, debt financing, exit strategies, real estate selling, refinancing, repositioning properties, regulatory compliance, zoning laws, building codes, landlord-tenant regulations, environmental regulations, client education, market updates, industry insights" />
      </Helmet>
      <Container fluid className={`${styles.ContactPageContainer}`}>
        <Row className={`${styles.HeroImageCon}`}>
          <Col md={10} lg={8} className={`${styles.ContactPageContent} text-center`}>
            <p>{t("contactFormPage.p1")}</p>
          </Col>
          <Col sm={12} className={`${styles.ContactFormCol}`}>
            <ContactForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContactPage;
