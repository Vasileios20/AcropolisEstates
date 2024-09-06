import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyPage() {
    /**
     * The PrivacyPolicyPage component is a functional component that renders the about page.
     * It contains information about the company and its values.
     * @returns {JSX.Element}
     */

    const { t } = useTranslation();



    return (
        <>
            <Container>
                <Row className="mt-5 flex-column">
                    <h1 style={{ fontSize: "25px" }}>{t("privacy.title")}</h1>
                    <p>{t("privacy.description")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section1.title")}</h2>
                    <p>{t("privacy.section1.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section2.title")}</h2>
                    <p>{t("privacy.section2.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section3.title")}</h2>
                    <p>{t("privacy.section3.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section4.title")}</h2>
                    <p>{t("privacy.section4.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section5.title")}</h2>
                    <p>{t("privacy.section5.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section6.title")}</h2>
                    <p>{t("privacy.section6.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section7.title")}</h2>
                    <p>{t("privacy.section7.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section8.title")}</h2>
                    <p>{t("privacy.section8.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("privacy.section9.title")}</h2>
                    <p>{t("privacy.section9.content")}</p>
                </Row>
            </Container>
        </>
    );
}
