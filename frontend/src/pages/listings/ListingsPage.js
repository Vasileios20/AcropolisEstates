import useFetchListings from "../../hooks/useFetchListings";
import ListingsComponent from "../../components/Listings";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ListingsPage({ setShowCookieBanner }) {
  /**
   * The ListingsPage component is a functional component that renders the listings page of the application.
   * It uses the useFetchListings hook to fetch the listings from the API.
   * It also uses the useLocation hook to get the state from the location object.
   * If the state is present, it sets the listings to the state data.
   * @returns {JSX.Element} - The JSX for the component.
   */

  // Fetch the listings from the API.
  const { listings, setListings, hasLoaded } = useFetchListings();

  // Get the state from the location object.
  const { state } = useLocation();

  // Message to display when there are no results.
  const message = "No results";

  // Variable to check if the search results are present.
  const [searchResults, setSearchResults] = useState(false);

  // If the state is present, set the listings to the state data.
  useEffect(() => {
    if (state && state.data) {
      // If the state is present, set the search results to true.
      setSearchResults(true);

      // If there are no results, set the listings to an empty array with the message.
      if (state.data.results.length === 0) {
        setListings({ results: [], message });
      } else {
        // Otherwise, set the listings to the state data.
        setListings(state.data);
      }
    }
  }, [setListings, state]);

  // If the state is present, display the state data, otherwise display the listings.
  const displayListings = state ? state.data : listings;

  return (
    <>
      <ListingsComponent
        array={displayListings.results}
        hasLoaded={hasLoaded}
        setListings={setListings}
        listings={listings}
        message={message}
        searchResults={searchResults}
        setShowCookieBanner={setShowCookieBanner}
      />
    </>
  );
}

export default ListingsPage;
