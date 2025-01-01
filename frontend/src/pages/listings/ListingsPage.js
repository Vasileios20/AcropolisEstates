import useFetchListings from "../../hooks/useFetchListings";
import ListingsComponent from "../../components/Listings";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ListingsPage({ nonEssentialConsent, setShowCookieBanner }) {
  const { listings, setListings, hasLoaded, fetchListings } = useFetchListings();
  const { state } = useLocation();
  const [searchResults, setSearchResults] = useState(false);
  const message = "No results";

  useEffect(() => {
    if (state?.data) {
      setSearchResults(true);

      const approvedListings = state.data.results.filter((listing) => listing.approved);
      setListings({
        results: approvedListings.length ? approvedListings : [],
        message: approvedListings.length ? undefined : message,
      });
    } else {
      fetchListings();
    }
  }, [state, setListings, fetchListings, message]);

  const displayListings = state?.data?.results.filter((listing) => listing.approved) ?? listings.results;

  return (
    <ListingsComponent
      array={displayListings}
      hasLoaded={hasLoaded}
      setListings={setListings}
      listings={listings}
      message={message}
      searchResults={searchResults}
      setShowCookieBanner={setShowCookieBanner}
      nonEssentialConsent={nonEssentialConsent}
    />
  );
}

export default ListingsPage;
