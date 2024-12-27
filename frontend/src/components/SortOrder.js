import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/SortOrder.module.css";
import { axiosReq } from "../api/axiosDefaults";
import Spinner from "react-bootstrap/Spinner";

const CustomDropdown = ({ options, onSelect, selected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`${styles.CustomDropdown} position-relative`}>
     
        <div
          className={`${styles.DropdownToggle}`}
          onClick={() => setIsOpen(!isOpen)}
        >
        {selected || <i className="fa fa-bars"></i>}
        </div>
      
      {isOpen && (
        <ul className={`${styles.DropdownMenu} position-absolute bg-white shadow`}>
          {options.map((option, index) => (
            <li
              key={index}
              className={`${styles.DropdownItem} p-2`}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#847c3d")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              style={{ cursor: "pointer" }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SortOrder = ({ listings, setListings }) => {
  const [sortOrder, setSortOrder] = useState("");
  const [loaded, setLoaded] = useState(false);

  const handleSortChange = async (value) => {
    setSortOrder(value);
    setLoaded(true);
    try {
      const { data } = await axiosReq.get(`/listings/?ordering=${value}`);
      setListings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoaded(false);
    }
  };

  const sortOptions = [
    { label: "Most recent", value: "-created_on" },
    { label: "Lowest price first", value: "price" },
    { label: "Highest price first", value: "-price" },
  ];

  return (
    <div className="d-flex justify-content-center align-items-center mb-2">
      <CustomDropdown
        options={sortOptions}
        onSelect={handleSortChange}
        selected={sortOptions.find((opt) => opt.value === sortOrder)?.label}
      />
      {loaded && <Spinner className="ms-2" animation="border" />}
    </div>
  );
};

export default SortOrder;