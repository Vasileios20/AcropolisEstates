import { useEffect, useState, useCallback } from "react";
import { axiosReq } from "../api/axiosDefaults";

const useFetchAllBookings = (searchQuery = '') => {
    const [bookings, setBookings] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const refetch = useCallback(() => {
        setRefetchTrigger(prev => prev + 1);
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Build URL with search parameter
                const url = searchQuery
                    ? `/short-term-bookings/?search=${encodeURIComponent(searchQuery)}`
                    : `/short-term-bookings/`;

                const { data } = await axiosReq.get(url);
                setBookings(data);
                setHasLoaded(true);
            } catch (err) {
                console.error(err);
                setHasLoaded(true);
            }
        };

        setHasLoaded(false);

        // Debounce search
        const timer = setTimeout(() => {
            fetchBookings();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, refetchTrigger]);

    return { bookings, setBookings, hasLoaded, refetch };
};

export default useFetchAllBookings;