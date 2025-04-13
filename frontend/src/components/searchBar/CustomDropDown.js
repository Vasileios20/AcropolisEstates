import React, { useEffect, useRef } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../../styles/SearchBar.module.css";
import { t } from "i18next";

export const CustomDropDown = ({ filters, setFilters, options, labelSelect, field }) => {

    const handleSelect = (value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    return (
        <Dropdown className="w-100">
            <Dropdown.Toggle className={`${styles.Select} text-start w-100`} style={{ borderColor: "#4d6765" }} id="dropdown-basic" >
                {labelSelect || (field === "type" ? `${t("listingType.any")}` : t("searchBar.heating"))}
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
    const inputRef = useRef(null);

    const formatValue = (value) => {
        if (!value) return "";
        const number = parseInt(String(value).replace(/,/g, ""), 10);
        return isNaN(number) ? "" : number.toLocaleString("de-DE", { useGrouping: true });
    };

    const parseValue = (value) => {
        if (!value) return "";
        return String(value).replace(/\./g, "");
    };

    const handleOption = (field, keyName, value) => {
        const rawValue = parseInt(parseValue(value), 10);

        setFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };

            if (keyName === "min") {
                updatedFilters[field] = {
                    ...prevFilters[field],
                    [keyName]: rawValue || 0,
                };
                if (rawValue > (prevFilters[field]?.max || 0)) {
                    updatedFilters[field].max = 0;
                }
            }

            if (keyName === "max") {
                if (rawValue === 0) {
                    updatedFilters[field] = {
                        ...prevFilters[field],
                        [keyName]: "",
                    };
                } else {
                    updatedFilters[field] = {
                        ...prevFilters[field],
                        [keyName]: rawValue,
                    };
                    if (rawValue < (prevFilters[field]?.min || 0)) {
                        updatedFilters[field].min = 0;
                    }
                }
            }

            return updatedFilters;
        });
    };

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
                type="text"
                className={`form-control`}
                placeholder={keyName === "min" ? field === "price" ? `€ ${t("searchBar.from")}` : t("searchBar.from") : field === "price" ? `€ ${t("searchBar.to")} ` : t("searchBar.to")}
                value={filters[field]?.[keyName] ? formatValue(filters[field][keyName]) : ""}
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
                        {option.label.toLocaleString("de-DE", { useGrouping: true })}
                    </div>
                ))}
            </div>
        </Dropdown>
    );
};

