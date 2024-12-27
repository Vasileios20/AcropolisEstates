import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../styles/Listing.module.css";
import heroStyles from "../styles/ServicesPages.module.css";

import Asset from "./Asset";
import ListingHeader from "./ListingHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useHistory } from "react-router-dom";
import { fetchMoreData } from "../utils/utils";
import SearchBar from "./SearchBar";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import SortOrder from '../components/SortOrder';
import { useMemo, useState } from "react";

const ListingsPage = ({ array, hasLoaded, setListings, listings, message, searchResults, setShowCookieBanner, nonEssentialConsent }) => {
  // The ListingsPage component is a functional component that renders the listings from the database.
  // It also renders the results of the search bar. The component uses the InfiniteScroll component to
  //  display the listings in an infinite scroll.
  // If the listings are not loaded, the component displays a spinner. If there are no results, the component displays a message.
  // The component also uses the SearchBar component to display the search bar at the top of the page.
  // The component also uses the AdvancedMarker component to display the markers on the map.
  // Get the lat and lng from the listings and push it in the array.
  const latLng = array.map((listing) => ({
    lat: listing.latitude,
    lng: listing.longitude,
  }));
  const lng = localStorage.getItem("i18n_language");

  const [search, setSearch] = useState("");

  const history = useHistory();
  useMemo(() => {
    const search = history.location.search;
    const params = new URLSearchParams(search);
    const searchQuery = params.get("search");
    setSearch(searchQuery);
  }, [history.location.search]);

  const listingMapMarkers = latLng.map((listing, index) => (
    <AdvancedMarker key={index} position={listing} />
  ));

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <Helmet>
        <title>{`Listings`}</title>
        <meta name="keywords" content="real estate, Acropolis Estates, real estate properties, property location, city postcode, property address, property type, property price, minimum price, maximum price, floor area, minimum floor area, maximum floor area, properties for sale, land for sale, apartments for sale, retail properties, office properties, Athens properties, Attiki properties, Sterea Ellada properties, real estate listings, property search, property filters, real estate market" />
      </Helmet>
      {!searchResults && <div className={` d-flex flex-column ${heroStyles.HeroImageListings}`}>

        <h1 className={heroStyles.HeaderListings} style={{ color: "#f3f3f3", backgroundColor: "transparent", }}>{t("propertiesPage.title")}</h1>
        <SearchBar />
      </div>}
      <Container fluid className="px-lg-5 pt-5">
        {searchResults && <SearchBar />}
        <Row className="mt-1 justify-content-around gx-0">
          <Row className="justify-content-around">
            <Col xs={6} className="text-start ps-md-5 ps-xs-2 ps-lg-2 me-auto">
              <p>
                {!searchResults ? `${array.length} ${t("propertiesPage.title")}` : array.length === 0 ?
                  t("propertiesPage.noProperties") : array.length === 1 ?
                    `${array.length} ${t("propertiesPage.title1")} ${search ? lng === "el" ?
                      `στο ${search}` : `in ${search}` : ""}` : `${array.length} ${t("propertiesPage.title")} ${search ? lng === "el" ?
                        `στο ${search}` : `in ${search}` : ""}`}
              </p>
            </Col>
            <Col xs={2} md={1} className="ms-auto">
              {array.length > 0 && <SortOrder listings={listings} setListings={setListings} />}
            </Col>
          </Row>
          <Col xs={12} lg={12} xl={8}>
            <Container
              id="scrollableDiv"
              style={{ height: 800, overflow: "auto" }}
            >
              {hasLoaded ? (
                <>
                  {array.length ? (
                    <InfiniteScroll
                      dataLength={array.length}
                      loader={<Asset spinner />}
                      hasMore={!!listings.next}
                      next={() => fetchMoreData(listings, setListings)}
                      scrollableTarget="scrollableDiv"
                    >
                      <Row className="mx-0">
                        {array.map((listing) => {
                          const sortedImages = [
                            ...listing.images.filter((image) => image.is_first),
                            ...listing.images.filter((image) => !image.is_first),
                          ];
                          return (
                            <Col key={listing.id} xs={12} md={6} lg={4} xl={4} className="mb-3 gx-1">
                              <Card style={{ height: "100%" }}>
                                <Carousel interval={null}>
                                  {sortedImages.map((image, id) => (
                                    <Carousel.Item key={id}>
                                      <div className={styles.Listings__ImageWrapper}>
                                        <img
                                          src={image?.url}
                                          alt={image?.id}
                                          className={`img-fluid ${styles.Listings__Image}`}
                                        />
                                      </div>
                                    </Carousel.Item>
                                  ))}
                                </Carousel>
                                <Link to={`/listings/${listing.id}`} className="text-decoration-none h-100">
                                  <ListingHeader
                                    {...listing}
                                    listingPage={true}
                                    setListings={setListings}
                                  />
                                </Link>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </InfiniteScroll>
                  ) : (
                    <Container>
                      <Asset message="No results found" />
                    </Container>
                  )}
                </>
              ) : (
                <Container>
                  <Asset spinner />
                </Container>
              )}
            </Container>
          </Col>
          <Col sm={12} lg={4} className="d-none d-xl-block ps-1">
            {nonEssentialConsent ? (
              <APIProvider apiKey={API_KEY}>
                <Map
                  mapId={"bf51a910020fa25a"}
                  defaultZoom={10}
                  defaultCenter={{
                    lat: 38.069472,
                    lng: 23.599510,
                  }}
                  gestureHandling={"greedy"}
                  style={{ width: "100%", height: "780px" }}
                >
                  {listingMapMarkers}
                </Map>
              </APIProvider>
            ) : (
              <div className="text-center">
                <h5>Enable cookies to view map</h5>
                <p onClick={() => setShowCookieBanner("show")} style={{ cursor: "pointer" }}>Click here to enable cookies</p>
              </div>
            )
            }
          </Col>
        </Row>
      </Container >
    </>
  );
};

export default ListingsPage;
