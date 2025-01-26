import { useState, useEffect } from 'react';

const useFetchLocationData = () => {
    const [regionsData, setRegionsData] = useState([]);
    useEffect(() => {
        const fetchRegionsData = async () => {
            try {
                const [greekResponse, englishResponse] = await Promise.all([
                    fetch(`/locales/el/regions.json`),
                    fetch(`/locales/en/regions.json`),
                ]);
                const [greekData, englishData] = await Promise.all([
                    greekResponse.json(),
                    englishResponse.json(),
                ]);

                // Combine Greek and English data with transliteration
                const combinedData = greekData.regions.map((greekRegion, index) => {
                    const englishRegion = englishData.regions[index];
                    return {
                        id: greekRegion.id,
                        greekName: greekRegion.region,
                        englishName: englishRegion.region,
                        counties: greekRegion.counties.map((greekCounty, countyIndex) => {
                            const englishCounty = englishRegion.counties[countyIndex];
                            return {
                                id: greekCounty.id,
                                greekName: greekCounty.county,
                                englishName: englishCounty.county,
                                municipalities: greekCounty.municipalities.map((greekMunicipality, municipalityIndex) => {
                                    const englishMunicipality = englishCounty.municipalities[municipalityIndex];
                                    return {
                                        id: greekMunicipality.id,
                                        greekName: greekMunicipality.municipality,
                                        englishName: englishMunicipality.municipality,
                                    };
                                }),
                            };
                        }),
                    };
                });
                setRegionsData(combinedData);
            } catch (error) {
                // console.error("Error fetching regions data:", error);
            }
        };

        fetchRegionsData();
    }, []);

    return {
        regionsData,
    };
};

export default useFetchLocationData;
