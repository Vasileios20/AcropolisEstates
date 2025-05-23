import React, { useState, useRef, useCallback, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "../../styles/Listing.module.css";
import heroStyles from "../../styles/ServicesPages.module.css";

import Asset from "../Asset";
import ListingHeader from "./ListingHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { fetchMoreData } from "../../utils/utils";
import SearchBar from "../searchBar/SearchBar";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import { APIProvider, AdvancedMarker, Map, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { t } from "i18next";
import { Helmet } from "react-helmet-async";
import SortOrder from '../SortOrder';
import imagesStyles from "../../styles/ListingImages.module.css";

const ListingsPage = ({ array, hasLoaded, setListings, listings, message, searchResults, setShowCookieBanner, nonEssentialConsent }) => {
  // The ListingsPage component is a functional component that renders the listings from the database.
  // It also renders the results of the search bar. The component uses the InfiniteScroll component to
  //  display the listings in an infinite scroll.
  // If the listings are not loaded, the component displays a spinner. If there are no results, the component displays a message.
  // The component also uses the SearchBar component to display the search bar at the top of the page.
  // The component also uses the AdvancedMarker component to display the markers on the map.
  // Get the lat and lng from the listings and push it in the array.
  const latLng = array.map((listing) => ({
    id: listing.id,
    position: {
      lat: listing.latitude,
      lng: listing.longitude,
    },
  }));

  const [hoveredId, setHoveredId] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [infoWindowShownId, setInfoWindowShownId] = useState(null);
  const markerRefs = useRef({});
  const listingRefs = useRef({});
  const infoWindowRef = useRef(null);

  const handleMarkerClick = useCallback(
    (id) => {
      setInfoWindowShownId((prevId) => (prevId === id ? null : id));
      if (listingRefs.current[id]) {
        listingRefs.current[id].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
    []
  );

  const handleClose = useCallback(() => {
    setHoveredId(null);
    setInfoWindowShownId(null);
  }, []);

  const onMouseEnter = (id) => {
    setHoveredId(id);
    setHovered(true);
    if (markerRefs.current[id]) {
      markerRefs.current[id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

  };

  const onMouseLeave = () => {
    setHovered(false);
    setHoveredId(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        infoWindowRef.current &&
        !infoWindowRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleClose]);

  const listingMapMarkers = latLng.map(({ id, position }) => (
    <>
      <AdvancedMarker
        key={id}
        position={position}
        zIndex={hovered && hoveredId === id ? 1000 : 1}
        ref={(el) => (markerRefs.current[id] = el)} // Assign a unique ref for each marker
        onClick={() => handleMarkerClick(id)}
      >
        <Pin
          background={hovered && hoveredId === id ? "#a35252" : "#4d6765"} // Highlight pin if hovered
          borderColor={hovered && hoveredId === id ? "#a35252" : "#4d6765"}
          glyphColor={"#ffffff"}
          scale={hovered && hoveredId === id ? 1.5 : 1}
        />
      </AdvancedMarker>
      {infoWindowShownId === id && (
        <InfoWindow
          anchor={markerRefs.current[id]}
          onClose={handleClose}
          maxWidth={200}
          headerDisabled
        >
          <Link to={`/listings/${id}`} className="text-decoration-none">
            <div
              className={` ${styles.Listings__InfoWindow}`}
              ref={infoWindowRef}
            >
              <Carousel interval={null}>
                {array.find((listing) => listing.id === id).images.map((image, id) => (
                  <Carousel.Item key={id}>
                    <div className={styles.Listings__ImageWrapper}>
                      <img
                        loading='lazy'
                        src={image?.url}
                        alt={image?.id}
                        className={`img-fluid ${styles.Listings__Image}`}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
              <div className={styles.Listings__InfoWindowContent}>
                <ListingHeader {...array.find((listing) => listing.id === id)} listingPage={false} />
              </div>

            </div>
          </Link>
        </InfoWindow>
      )}
    </>
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

        <Row className="justify-content-between gx-0">
          <Col xs={12} lg={12} xl={8} className={`${styles.Listings__Container}`}>
            <Container className="px-0">
              <Row className="justify-content-between align-items-center px-1">
                <Col xs={6} className="">
                  <p className="">
                    {!searchResults ? `${array.length} ${t("propertiesPage.title2")}` : array.length === 0 ?
                      "" : array.length === 1 ?
                        `${array.length} ${t("propertiesPage.title1")}` : `${array.length} ${t("propertiesPage.title2")} `}
                  </p>
                </Col>
                <Col xs={6} className="d-flex justify-content-end">
                  {array.length > 0 && <SortOrder listings={listings} setListings={setListings} />}
                </Col>
              </Row>
            </Container>
            <Container
              id="scrollableDiv"
              style={{ height: 800, overflow: "auto" }}
              className="px-0"
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
                          const sold = listing?.amenities?.find(amenity => amenity.name === 'sold');
                          
                          return (
                            <Col key={listing.id} xs={12} md={6} lg={4} className="mb-4 gx-4"
                              ref={(el) => (listingRefs.current[listing.id] = el)}>
                              <Card style={{ height: "100%" }}
                                onMouseEnter={() => { onMouseEnter(listing.id); }}
                                onMouseLeave={() => { onMouseLeave(); }}
                                className={infoWindowShownId === listing.id ? styles.Highlighted : styles.Listings__Card}
                              >

                                <Carousel interval={null}>
                                  {sortedImages.map((image, id) => (
                                    <Carousel.Item key={id}>
                                      {sold && <div className={imagesStyles.soldLabelListings}>SOLD</div>}
                                      <div className={styles.Listings__ImageWrapper}>
                                        <img
                                          loading='lazy'
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
          <Col sm={12} lg={4} className="d-none d-xl-block ps-1 mt-4 pt-3">
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
                  {listingMapMarkers.map((marker, index) => (
                    <React.Fragment key={index}>{marker}</React.Fragment>
                  ))}
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
