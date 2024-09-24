import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

export default function TermsPage() {
    /**
     * The TermsPage component is a functional component that renders the about page.
     * It contains information about the company and its values.
     * @returns {JSX.Element}
     */

    const { t } = useTranslation();


    return (
        <>
            <Container>
                <Row className="mt-5 flex-column">
                    <h1 style={{ fontSize: "25px" }}>{t("terms.title")}</h1>
                    <p>{t("terms.description")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section1.title")}</h2>
                    <p>{t("terms.section1.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section2.title")}</h2>
                    <p>{t("terms.section2.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section3.title")}</h2>
                    <p>{t("terms.section3.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section4.title")}</h2>
                    <p>{t("terms.section4.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section5.title")}</h2>
                    <p>{t("terms.section5.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section6.title")}</h2>
                    <p>{t("terms.section6.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section7.title")}</h2>
                    <p>{t("terms.section7.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section8.title")}</h2>
                    <p>{t("terms.section8.content")}</p>
                    <h2 style={{ fontSize: "20px" }}>{t("terms.section9.title")}</h2>
                    <p>{t("terms.section9.content")}
                        <Trans i18nKey="terms.section9.email" components={{
                            1: <Link to="/contact" />
                        }} />
                    </p>
                </Row>
            </Container>
        </>
    );
}
