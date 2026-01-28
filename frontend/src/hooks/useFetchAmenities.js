import { useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';

/**
 * Custom hook to fetch ALL amenities with automatic pagination
 * Handles Django REST Framework pagination to load all items (100+)
 */
const useFetchAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllAmenities = async () => {
            try {
                setHasLoaded(false);
                let allAmenities = [];
                let nextUrl = '/amenities/';
                let pageCount = 0;
                const maxPages = 10; // Safety limit

                // Keep fetching until there's no next page
                while (nextUrl && pageCount < maxPages) {
                    const { data } = await axiosReq.get(nextUrl);

                    // Add results to our collection
                    if (data.results && Array.isArray(data.results)) {
                        allAmenities = [...allAmenities, ...data.results];
                    } else if (Array.isArray(data)) {
                        // Direct array response (no pagination)
                        allAmenities = [...allAmenities, ...data];
                        break;
                    }

                    // Get next page URL
                    nextUrl = data.next;

                    // Handle full URLs by extracting the path
                    if (nextUrl && (nextUrl.startsWith('http://') || nextUrl.startsWith('https://'))) {
                        const url = new URL(nextUrl);
                        const baseURL = axiosReq.defaults?.baseURL || '';

                        // Remove baseURL from path to avoid duplication
                        if (baseURL && url.pathname.startsWith(baseURL)) {
                            nextUrl = url.pathname.substring(baseURL.length) + url.search;
                        } else {
                            nextUrl = url.pathname + url.search;
                        }
                    }

                    pageCount++;
                }

                setAmenities(allAmenities);
                setHasLoaded(true);
            } catch (err) {
                console.error('Error fetching amenities:', err);
                setError(err);
                setHasLoaded(true);
            }
        };

        fetchAllAmenities();
    }, []);

    return { amenities, hasLoaded, error };
};

export default useFetchAmenities;