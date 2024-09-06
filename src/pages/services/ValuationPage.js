import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styles from "../../styles/ServicesPages.module.css";
import { useTranslation, Trans } from "react-i18next";
import { Helmet } from "react-helmet-async";

export default function ValuationPage() {
  /**
   * The Valuation component is a functional component that renders the valuation page.
   * It contains information about the company and its values.
   * @returns {JSX.Element}
  */

  const { t } = useTranslation();


  return (
    <>
      <Helmet>
        <title>{t("services.valuation")}</title>
        <meta name="keywords" content="acropolis estates, eal estate valuation, property inspection, market analysis, market value assessment, comparable sales analysis, income approach, cost approach, valuation report, appraisal report, investment analysis, financing, insurance, tax assessment, financial reporting, professional standards, regulatory compliance, USPAP, Appraisal Institute, client communication, property market value, physical condition assessment, market trends, rental rates, vacancy rates, economic indicators, property amenities, visible defects, maintenance issues" />
      </Helmet>
      <div className={`${styles.HeroImageVal}`}>
        <div className={`col-6 ${styles.HeaderContainer}`}>
          <h1 className={styles.Header}>{t("services.valuation")}</h1>
        </div>
      </div>
      <Container>
        <Row className={`shadow my-5 mx-auto ${styles.PageContentWrapper}`}>
          <Row className={`m-0 p-0 ${styles.PageContent}`}>
            <div className="my-5 col-11 mx-auto">
              {t("valuationPage.p1")}
            </div>
          </Row>
        </Row>

        <Row className="mx-auto mb-5 shadow">
          <div className={styles.PageList}>
            <ul className={styles.List}>
              <li><Trans i18nKey="valuationPage.listItem1">{t("valuationPage.listItem1")}</Trans></li>
              <li><Trans i18nKey="valuationPage.listItem2">{t("valuationPage.listItem2")}</Trans></li>
              <li><Trans i18nKey="valuationPage.listItem3">{t("valuationPage.listItem3")}</Trans></li>
              <li><Trans i18nKey="valuationPage.listItem4">{t("valuationPage.listItem4")}</Trans></li>
              <li><Trans i18nKey="valuationPage.listItem5">{t("valuationPage.listItem5")}</Trans></li>
              <li><Trans i18nKey="valuationPage.listItem6">{t("valuationPage.listItem6")}</Trans></li>
            </ul>
          </div>
        </Row>
      </Container>
    </>
  );
}
