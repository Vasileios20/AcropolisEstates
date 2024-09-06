import React from "react";
import styles from "../../styles/ServicesPages.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useTranslation, Trans } from "react-i18next";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

export default function AssetManagementPage() {
  /**
   * The Asset Management Page component is a functional component that renders the asset management page.
   * It contains information about the company and its values.
   * @returns {JSX.Element}
   */
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("services.assetManagement")}</title>
        <meta name="keywords" content="real estate asset management, property performance monitoring, lease management, financial analysis, risk management, maintenance and repairs, tenant relations, strategic planning, market research, reporting, compliance, sustainability initiatives, portfolio management, asset valuation, stakeholder communication, value creation, risk mitigation, customized solutions, industry experience, client-focused approach, maximizing returns, minimizing risks, property performance, rental income, occupancy rates, budgeting, forecasting, variance analysis, property ownership, market fluctuations, tenant defaults, property damage, regulatory standards, tenant satisfaction, property value, renovations, repositioning, redevelopment, market trends, property management, energy efficiency, environmental stewardship, acquisitions, dispositions, portfolio optimization, acropolis, estates, london, " />
      </Helmet>
      <div className={styles.HeroImageAssetMgmt}>
        <div className={`col-6 ${styles.HeaderContainer}`}>
          <h1 className={styles.Header} style={{ fontSize: "3.5rem" }}>{t("services.assetManagement")}</h1>
        </div>
      </div>
      <Container>
        <Row className={`my-5 flex-wrap mx-auto justify-content-between`}>
          <Col lg={6} className={`shadow mb-0 me-lg-3 ${styles.PageContentWrapper}`}>
            <div className={`p-4 h-100 ${styles.PageContent}`}>
              {t("assetManagementPage.p1")}
            </div>
          </Col>

          <Col className={`shadow mb-0 mt-5 mt-lg-0 ${styles.PageContentWrapper}`}>
            <div className={`p-4 h-100 ${styles.PageContent}`}>
              {t("assetManagementPage.p2")}
            </div>
          </Col>
        </Row>

        <Row className="shadow mx-auto mb-5">
          <div className={styles.PageList}>
            <ul className={styles.List}>
              <li><Trans i18nKey="assetManagementPage.listItem1">{t("assetManagementPage.listItem1")}
              </Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem2">{t("assetManagementPage.listItem2")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem3">{t("assetManagementPage.listItem3")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem4">{t("assetManagementPage.listItem4")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem5">{t("assetManagementPage.listItem5")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem6">{t("assetManagementPage.listItem6")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem7">{t("assetManagementPage.listItem7")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem8">{t("assetManagementPage.listItem8")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem9">{t("assetManagementPage.listItem9")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem10">{t("assetManagementPage.listItem10")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem11">{t("assetManagementPage.listItem11")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem12">{t("assetManagementPage.listItem12")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem13">{t("assetManagementPage.listItem13")}</Trans></li>
              <li><Trans i18nKey="assetManagementPage.listItem14">{t("assetManagementPage.listItem14")}</Trans></li>
            </ul>
          </div>
        </Row>
      </Container>
    </>
  );
}
