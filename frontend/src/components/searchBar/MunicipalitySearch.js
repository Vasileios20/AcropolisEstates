import React, { useState, useEffect } from "react";
import styles from "../../styles/MunicipalitySearch.module.css";
import { t } from "i18next";
import Form from "react-bootstrap/Form";

const MunicipalitySearch = ({ regionsData, onSearch, municipalityId, history }) => {
    const [inputValue, setInputValue] = useState("");
    const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const munID = history.location.state?.data.results[0].municipality_id;

    useEffect(() => {
        if (munID) {
            const allMunicipalities = regionsData?.flatMap(region =>
                region.counties?.flatMap(county =>
                    county.municipalities?.map(municipality => ({
                        id: municipality.id,
                        name: municipality.municipality,
                        county_id: county.id
                    }))
                )
            ) || [];

            const selectedMunicipality = allMunicipalities.find(municipality => municipality.id === munID);

            if (selectedMunicipality) {
                setInputValue(selectedMunicipality.name);
            }
        }
    }, [regionsData, munID]);

    const normalizeString = (str) => {
        if (!str) return "";
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    const handleInputChange = (e) => {
        const value = e.target.value;

        setInputValue(value);

        if (value) {
            const allMunicipalities = regionsData?.flatMap(region =>
                region.counties?.flatMap(county =>
                    county.municipalities?.map(municipality => ({
                        id: municipality.id,
                        name: municipality.municipality,
                        county_id: county.id,
                        county_name: county.county,
                        region_id: region.id,
                        region_name: region.region,
                    }))
                )
            ) || [];

            const uniqueMunicipalities = new Map();
            allMunicipalities.forEach(municipality => {
                const normalizedName = normalizeString(municipality.name);
                if (!uniqueMunicipalities.has(normalizedName)) {
                    uniqueMunicipalities.set(normalizedName, municipality);
                }
            });

            const filtered = Array.from(uniqueMunicipalities.values())
                .filter(municipality =>
                    normalizeString(municipality.name).includes(normalizeString(value))
                )
                .sort((a, b) => String(a.id).localeCompare(String(b.id)));

            setFilteredMunicipalities(filtered);
            setShowDropdown(true);
        } else {
            setFilteredMunicipalities([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (municipality) => {
        setInputValue(municipality.name);
        setShowDropdown(false);

        if (onSearch) {
            onSearch(municipality);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 200);
    };

    const handleFocus = () => {
        if (filteredMunicipalities.length > 0) {
            setShowDropdown(true);
        }
    };

    return (
        <>
            <Form.Control
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={t("searchBar.search")}
                className="form-control"
            />
            {showDropdown && (
                <ul className={styles.MunicipalityDropdownSearch}>
                    {filteredMunicipalities.length > 0 &&
                        filteredMunicipalities.map((municipality, index) => (
                            <li
                                key={`${municipality.id}-${index}`}
                                onClick={() => handleSelect(municipality)}
                            >
                                {municipality.name}
                            </li>
                        ))
                    }
                </ul>
            )}
        </>
    );
};

export default MunicipalitySearch;
