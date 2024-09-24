import { useState, useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";

const useFetchAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const { data } = await axiosReq.get("amenities/");
                setAmenities(data.results);
            }
            catch (err) {
                // console.log(err);
            }
        }
        fetchAmenities();
    }, []);
    return { amenities, setAmenities };
}

export default useFetchAmenities;