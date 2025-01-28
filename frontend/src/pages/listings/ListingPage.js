import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Listing from "../../components/listings/Listing";
import Asset from "../../components/Asset";
import Container from "react-bootstrap/Container";
import useUserStatus from "../../hooks/useUserStatus";

function ListingPage({ setShowCookieBanner, nonEssentialConsent }) {
  /**
   * The ListingPage component is a functional component that renders a single listing.
   * It fetches the listing data from the API using the listing id from the URL.
   * @returns {JSX.Element} - The JSX for the component.
   * @param {Object} listing - The listing data.
   * @param {Function} setListings - A function to set the listings state.
   */

  const { id } = useParams();
  const [listing, setListing] = useState({ results: [] });
  const history = useHistory();
  const [hasLoaded, setHasLoaded] = useState(false);
  const userStatus = useUserStatus();

  // If the listing has been edited, reload the page.
  if (window.localStorage.getItem("edited") === "true") {
    window.location.reload();
    localStorage.removeItem("edited");
  }

  useEffect(() => {
    if (userStatus === null) {
      return;
    }
    // Fetch the listing from the API.
    const handleMount = async () => {
      try {
        const [{ data: listing }] = await Promise.all([
          axiosReq.get(`/listings/${id}/`),
        ]);
        if (userStatus) {
          setListing({ results: [listing] });
          setHasLoaded(true);
          return;
        }
        if (listing.approved) {
          setListing({ results: [listing] });
          setHasLoaded(true);
          return;
        }
        history.push("/forbidden");
      } catch (err) {
        if (err.response.status === 404) {
          history.push("/notfound");
        }
        // console.log(err);
      }
    };
    handleMount();
  }, [id, history, userStatus]);

  return (
    <>
      {hasLoaded ?
        <Listing {...listing.results[0]} setListings={setListing} listingPage setShowCookieBanner={setShowCookieBanner} nonEssentialConsent={nonEssentialConsent} />
        : <Container className="mt-5">
          <Asset spinner />
        </Container>
      }
    </>
  );
}

export default ListingPage;
