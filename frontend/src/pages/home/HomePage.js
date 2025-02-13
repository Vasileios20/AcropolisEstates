import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import homeStyles from "../../styles/HomePage.module.css";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "../../components/searchBar/SearchBar";
import styles from "../../styles/ServicesPages.module.css";
import useFetchListings from "../../hooks/useFetchListings";
import Asset from "../../components/Asset";
import { Carousel } from "react-bootstrap";
import imageStyles from "../../styles/Listing.module.css";
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  /**
   * The HomePage component is a functional component that renders the home page.
   * It contains a search bar and a welcome message.
   * @returns {JSX.Element} - The JSX for the component.
   */

  const { t } = useTranslation();

  const fetchedFeaturedListings = useFetchListings();

  const { hasLoaded } = useFetchListings();

  const featuredListings = fetchedFeaturedListings.listings.results.filter((listing) => listing.featured === true)


  return (
    <>
      <Helmet>
        <title>{t("homePage.header")}</title>
        <meta name="keywords" content="acropolis estates, real estate advisory, real estate guidance, strategic advice,
        real estate investments, market analysis, property values, investment opportunities, financial planning, budgeting,
        cash flow analysis, risk assessment, market volatility, regulatory changes, property inspections, title searches, environmental assessments,
        due diligence, portfolio optimization, investment diversification, tax planning, tax-efficient investment, financing assistance, real estate financing, debt financing, exit strategies, real estate selling, refinancing, repositioning properties, regulatory compliance, zoning laws, building codes, landlord-tenant regulations, environmental regulations, client education, market updates, industry insights" />
      </Helmet>
      <div className={`${homeStyles.CaruselContainer}`}>
        <div className={homeStyles.SearchBar}>
          <h1 className={`text-center ${homeStyles.Welcome}`}>{t("homePage.header")}</h1>
          <p className={`text-center ${homeStyles.WelcomeTagLine}`}>{t("homePage.tagline")}</p>
          <SearchBar />
        </div>
        <Carousel prevIcon={false} nextIcon={false}>
          <Carousel.Item>
            <div className={`d-flex flex-column justify-content-evenly ${homeStyles.HeroImage}`}>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className={`d-flex flex-column justify-content-evenly ${homeStyles.HeroImage2}`}>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className={`d-flex flex-column justify-content-evenly ${homeStyles.HeroImage3}`}>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      <Container className="mb-4">
        <Row className={`shadow my-5 mx-auto ${styles.PageContentWrapper}`}>
          <Row className={`m-0 ${styles.PageContent} ${homeStyles.HomePageContent}`}>
            <p className="col-md-11 mx-auto py-5">{t("homePage.description")}</p>
          </Row>
        </Row>
        <Row className="gx-2">
          <h2 className="my-4 text-center w-100">{t("homePage.header2")}</h2>
          <Col xs={12} md={6} className="mt-1">
            <Link to="/assetManagement">
              <Card className="h-100">
                <div
                  className={`${styles.ServiceImage1} ${styles.ServiceImageHeight}`}
                />
                <Card.Body>
                  <Card.Title>
                    {t("services.assetManagement")}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col xs={12} md={6} className="mt-1">
            <Link to="/advisory">
              <Card className="h-100">
                <div
                  className={`${styles.ServiceImage2} ${styles.ServiceImageHeight}`}
                />
                <Card.Body>
                  <Card.Title>
                    {t("services.financialAdvice")}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          {/* Valuation */}
          <Col xs={12} md={6} className="mt-1 mt-md-2">
            <Link to="/valuation">
              <Card className="h-100">
                <div
                  className={`${styles.ServiceImage3} ${styles.ServiceImageHeight}`}
                />
                <Card.Body>
                  <Card.Title>
                    {t("services.valuation")}
                  </Card.Title>

                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col xs={12} md={6} className="mt-1 mt-md-2">
            <Link to="/listings">
              <Card className="h-100 rounded">
                <div
                  alt="Property Management"
                  className={`${styles.ServiceImage4} ${styles.ServiceImageHeight}`}
                />
                <Card.Body>
                  <Card.Title>
                    {t("services.properties")}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
        <Row className="my-5">
          <h2 className="my-4 text-center w-100">{t("homePage.header3")}</h2>
          <Container>
            <Row className="mx-0">
              {hasLoaded ? (
                <>
                  {featuredListings.length ? (
                    <Row className="mx-0">
                      {featuredListings
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 4)
                        .map((listing) => (
                          <Col key={listing.id} xs={12} md={6} lg={3} className="mb-3">
                            <Card style={{ height: "100%" }}>
                              <div className={homeStyles.FeaturedLabel}>Featured</div>
                              <Carousel interval={null}>
                                {listing.images.map((image, id) => (
                                  <Carousel.Item key={id}>
                                    <div className={imageStyles.Listings__ImageWrapper}>
                                      <img
                                        loading="lazy"
                                        src={image?.url}
                                        alt={image?.id}
                                        className={`img-fluid ${imageStyles.Listings__Image}`}
                                      />
                                    </div>
                                  </Carousel.Item>
                                ))}
                              </Carousel>
                              <Link to={`/listings/${listing.id}`}>
                                <Card.Body>
                                  <Card.Title style={{ textTransform: "capitalize" }}>
                                    {t("propertyDetails.title", {
                                      type: listing.type === "Land" ? `${t(`propertyDetails.${listing.type}`)}` : `${t(`propertyDetails.subTypes.${listing.sub_type}`)}`,
                                      sale_type: listing.sale_type === "rent" ? `${t("propertyDetails.typeRent")}` : `${t("propertyDetails.typeSale")}`,
                                    })}
                                  </Card.Title>
                                  <Card.Text>{listing.currency} {typeof listing.price === "number" && !isNaN(listing.price) && listing.price.toLocaleString("de-DE")}</Card.Text>
                                </Card.Body>
                              </Link>
                            </Card>
                          </Col>
                        ))}
                    </Row>
                  ) : (
                    <Container>
                      <Asset text="No results" />
                    </Container>
                  )}
                </>
              ) : (
                <Container>
                  <Asset spinner />
                </Container>
              )}
            </Row>
          </Container>
        </Row>
      </Container >
    </>
  );
}
