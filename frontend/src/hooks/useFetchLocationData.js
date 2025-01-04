import { useState, useEffect } from 'react';
import i18n from 'i18next';

const useFetchLocationData = () => {
    const [regionsData, setRegionsData] = useState([]);
    const lng = i18n.language;

    useEffect(() => {
        const fetchRegionsData = async () => {
            try {
                const response = await fetch(`/locales/${lng}/regions.json`);
                const data = await response.json();
                setRegionsData(data.regions);
            } catch (error) {
                console.error("Error fetching regions data:", error);
            }
        };

        fetchRegionsData();
    }, [lng]);

    return {
        regionsData,
    };
};

export default useFetchLocationData;