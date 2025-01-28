import { useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';

const useFetchOwners = () => {
    const [owners, setOwners] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axiosReq.get('/listings/owners/');
                setOwners(response.data.results);
                setHasLoaded(true);
            } catch (error) {
                console.error(error);
            }
        }
        fetchOwners();
    }, []);
    return { owners, setOwners, hasLoaded };
}

export default useFetchOwners;