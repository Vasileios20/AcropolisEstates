import React, { useState, useEffect, useRef } from "react";
import styles from "../../styles/MunicipalitySearch.module.css";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";

const MunicipalitySearch = ({ regionsData, onSearch, history, saleType, empty, setEmpty }) => {
    const [inputValue, setInputValue] = useState("");
    const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const municipalityId = history.location.state?.data?.results?.length
        ? history.location.state.data.results[0].municipality_id
        : null;
    const containsMunicipality = history.location.search.includes("municipality");
    const { t, i18n } = useTranslation();
    const lng = i18n?.language;

    useEffect(() => {
        if (containsMunicipality) {
            const allMunicipalities = regionsData?.flatMap(region =>
                region.counties?.flatMap(county =>
                    county.municipalities?.map(municipality => ({
                        id: municipality.id,
                        greekName: municipality.greekName,
                        englishName: municipality.englishName,
                    }))
                )
            ) || [];

            const selectedMunicipality = allMunicipalities.find(municipality => municipality.id === municipalityId);

            if (selectedMunicipality) {
                setInputValue(lng === 'el' ? selectedMunicipality.greekName : selectedMunicipality.englishName);
            }
        }
    }, [regionsData, municipalityId, containsMunicipality, lng]);

    const normalizeString = (str) => {
        if (!str) return "";
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .toLowerCase();
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setSelectedIndex(-1);

        if (!value) {
            setEmpty(true);
        }

        if (value) {
            setEmpty(false);

            const allMunicipalities = regionsData?.flatMap(region =>
                region.counties?.flatMap(county =>
                    county.municipalities?.map(municipality => ({
                        id: municipality.id,
                        greekName: municipality.greekName,
                        englishName: municipality.englishName,
                        county_id: county.id,
                        county_name: county.county,
                        region_id: region.id,
                        region_name: region.region,
                    }))
                )
            ) || [];

            const filtered = allMunicipalities.filter(municipality => {
                const searchValue = normalizeString(value);
                return (
                    normalizeString(municipality.greekName).includes(searchValue) ||
                    normalizeString(municipality.englishName).includes(searchValue)
                );
            });

            setFilteredMunicipalities(filtered);
            setShowDropdown(true);
        } else {
            setFilteredMunicipalities([]);
            setShowDropdown(false);
        }
    };

    const handleSelect = (municipality) => {
        setInputValue(lng === 'el' ? municipality.greekName : municipality.englishName);
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

    const handleKeyDown = (e) => {
        if (!showDropdown || filteredMunicipalities.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => {
                const nextIndex = prevIndex < filteredMunicipalities.length - 1 ? prevIndex + 1 : 0;
                scrollIntoView(nextIndex);
                return nextIndex;
            });
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => {
                const nextIndex = prevIndex > 0 ? prevIndex - 1 : filteredMunicipalities.length - 1;
                scrollIntoView(nextIndex);
                return nextIndex;
            });
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredMunicipalities[selectedIndex]);
        }
    };

    const scrollIntoView = (index) => {
        if (dropdownRef.current) {
            const dropdownItems = dropdownRef.current.children;
            const selectedItem = dropdownItems[index];
            if (selectedItem) {
                selectedItem.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    };

    return (
        <>
            <Form.Control
                type="text"
                value={inputValue ? inputValue : ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={t("searchBar.search")}
                className={`"form-control" ${styles.MunicipalitySearch}`}
            />
            {showDropdown && filteredMunicipalities.length > 0 && (
                <ul ref={dropdownRef} className={styles.MunicipalityDropdownSearch}>
                    {filteredMunicipalities.map((municipality, index) => (
                        <li
                            key={`${municipality.id}-${index}`}
                            onClick={() => handleSelect(municipality)}
                            className={index === selectedIndex ? styles.SelectedItem : ""}
                        >
                            {lng === 'el' ? municipality.greekName : municipality.englishName}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default MunicipalitySearch;
