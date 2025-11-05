import { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useLocation } from "react-router-dom";

const useFetchShortTermListings = () => {
    /**
     * The useFetchAllListings hook is a custom hook that fetches all the listings from the API.
     * @returns {Object} - The listings data.
     * @returns {Function} - A function to set the listings state.
     * @returns {Boolean} - A boolean indicating whether the listings have loaded.
     * @returns {String} - The pathname from the location object.
     */

    const { pathname } = useLocation();
    const [listings, setListings] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        // Fetch the listings from the API.
        const fetchListings = async () => {
            try {
                const { data } = await axiosReq.get(`/short-term-listings/`);
                setListings({ results: data.results });
                setHasLoaded(true);
            } catch (err) {
                // console.log(err);
            }
        };
        // If the pathname changes, fetch the listings again.
        setHasLoaded(false);
        fetchListings();
    }, [pathname]);

    return { listings, setListings, hasLoaded, pathname };
};

export default useFetchShortTermListings;