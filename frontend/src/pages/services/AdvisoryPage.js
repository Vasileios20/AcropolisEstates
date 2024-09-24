import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import styles from "../../styles/ServicesPages.module.css";
import { useTranslation, Trans } from "react-i18next";
import { Helmet } from "react-helmet-async";

export default function FinancialAdvicePage() {
  /**
   * The AboutPage component is a functional component that renders the about page.
   * It contains information about the company and its values.
   * @returns {JSX.Element}
  */

  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("services.financialAdvice")}</title>
        <meta name="keywords" content="real estate, Acropolis Estates, real estate advisory, market analysis, financial planning, risk assessment, due diligence, portfolio optimization, tax planning, financing assistance, exit strategies, regulatory compliance, client education, property inspections, title searches, environmental assessments, investment viability, diversification, consolidation, disposition, tax-efficient investment, debt financing, refinancing, repositioning properties, zoning laws, building codes, landlord-tenant regulations, market updates, industry insights " />
      </Helmet>
      <div className={styles.HeroImageAdv}>
        <div className={`col-6 ${styles.HeaderContainer}`}>
          <h1 className={styles.Header}>{t("services.financialAdvice")}</h1>
        </div>
      </div>
      <Container>
        <Row className={`shadow my-5 mx-auto ${styles.PageContentWrapper}`}>
          <Row className={`m-0 p-0 ${styles.PageContent}`}>
            <div className="my-5 col-11 mx-auto">
              {t("advisoryPage.p1")}
            </div>
          </Row>
        </Row>

        <Row className="mb-5 mx-auto shadow">
          <div className={styles.PageList}>
            <ul className={styles.List}>
              <li><Trans i18nKey="advisoryPage.listItem1">{t("advisoryPage.listItem1")}
              </Trans></li>

              <li><Trans i18nKey="advisoryPage.listItem3">{t("advisoryPage.listItem3")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem4">{t("advisoryPage.listItem4")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem5">{t("advisoryPage.listItem5")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem6">{t("advisoryPage.listItem6")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem7">{t("advisoryPage.listItem7")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem8">{t("advisoryPage.listItem8")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem9">{t("advisoryPage.listItem9")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem10">{t("advisoryPage.listItem10")}
              </Trans></li>
              <li><Trans i18nKey="advisoryPage.listItem11">{t("advisoryPage.listItem11")}
              </Trans></li>



            </ul>
          </div>
        </Row>
      </Container>
    </>
  );
}
