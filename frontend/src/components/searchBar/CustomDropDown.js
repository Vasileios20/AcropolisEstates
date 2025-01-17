import React, { useEffect, useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../../styles/SearchBar.module.css";
import { t } from "i18next";

export const CustomDropDown = ({ filters, setFilters, options, labelCapitalized }) => {
    const handleSelect = (e) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            type: e,
        })
        );
    };

    return (
        <Dropdown className="w-100">
            <Dropdown.Toggle className={`${styles.Select} text-start w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic" >
                {labelCapitalized || t("listingType.any")}
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.TypeDropdown}>
                {options?.map((option) => (
                    <Dropdown.Item
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};



export const MainFieldsDropDown = ({ filters, setFilters, options, field, keyName, show, setShow }) => {
    const handleOption = (field, keyName, value) => {
        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (keyName === "min" && value > prevFilters[field]?.max) {
                updatedFilters[field] = { ...prevFilters[field], [keyName]: value, max: 0 };
            } else if (keyName === "max" && value < prevFilters[field]?.min) {
                updatedFilters[field] = { ...prevFilters[field], [keyName]: value, min: 0 };
            } else {
                updatedFilters[field] = { ...prevFilters[field], [keyName]: value };
            }

            if (updatedFilters[field]?.min > updatedFilters[field]?.max) {
                updatedFilters[field].max = 0;
            } else if (updatedFilters[field]?.max < updatedFilters[field]?.min) {
                updatedFilters[field].min = 0;
            }

            return updatedFilters;
        });
    };

    const inputRef = useRef(null);

    const triggerBlinking = () => {
        if (inputRef.current) {
            inputRef.current.classList.remove(styles.BlinkingInput);
            void inputRef.current.offsetWidth;
            inputRef.current.classList.add(styles.BlinkingInput);
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        if (show) {
            triggerBlinking();
        }
    }, [show]);

    return (
        <Dropdown className="w-100">
            <input
                ref={inputRef}
                type="number"
                className={`${styles.SearchInput} form-control`}
                placeholder={keyName === "min" ? t("searchBar.from") : t("searchBar.to")}
                value={filters[field]?.[keyName] || ""}
                onChange={(e) => handleOption(field, keyName, e.target.value)}
            />
            <div className={styles.MainFieldsDropdown} onClick={(e) => e.stopPropagation()}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        onClick={() => handleOption(field, keyName, option.value)}
                        style={{ backgroundColor: filters[field]?.[keyName] === option.value ? "#4d6765" : "", color: filters[field]?.[keyName] === option.value ? "white" : "" }}
                        className={styles.MainFieldsOption}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </Dropdown>
    );
};
