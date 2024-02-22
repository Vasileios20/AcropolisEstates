import { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useLocation } from "react-router-dom";

const useFetchListings = () => {
  /**
   * The useFetchListings hook is a custom hook that fetches all the listings from the API.
   * @returns {Object} - The listings data.
   * @returns {Function} - A function to set the listings state.
   * @returns {Boolean} - A boolean indicating whether the listings have loaded.
   * @returns {String} - The pathname from the location object.
   */

  const { pathname } = useLocation();
  const [listings, setListings] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data } = await axiosReq.get(`/listings/`);
        setListings(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };
    setHasLoaded(false);
    fetchListings();
  }, [pathname]);

  return { listings, setListings, hasLoaded, pathname };
};

export default useFetchListings;
