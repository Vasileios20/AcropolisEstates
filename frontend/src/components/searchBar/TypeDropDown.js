import Dropdown from "react-bootstrap/Dropdown";
import styles from "../../styles/SearchBar.module.css";
import { t } from "i18next";

const CustomDropdown = ({ filters, setFilters }) => {
    const typeCapitalized = filters?.type?.replace(/\b\w/g, char => char.toUpperCase());
    const options = [
        { value: "", label: t("listingType.any") },
        { value: "residential", label: t("listingType.residential") },
        { value: "land", label: t("listingType.land") },
        { value: "commercial", label: t("listingType.commercial") },
    ];

    const handleSelect = (e) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            type: e,
        })
        );
    };

    return (
        <Dropdown className="w-100">
            <Dropdown.Toggle className={`${styles.TypeSelect} text-start`} id="dropdown-basic">
                {typeCapitalized || t("listingType.any")}
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.TypeDropdown}>
                {options.map((option) => (
                    <Dropdown.Item
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                    >
                        {t(`listingType.${option.value}`)}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CustomDropdown;