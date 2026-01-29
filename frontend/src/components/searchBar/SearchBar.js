import React, { useEffect, useMemo, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import styles from "../../styles/SearchBar.module.css";

import { axiosReq } from "../../api/axiosDefaults";
import { useHistory } from "react-router-dom";
import useFetchLocationData from "../../hooks/useFetchLocationData";
import AdvancedFiltersModal from "./AdvancedFiltersModal";
import { SaleTypeSearch } from "./SaleTypeSearch";
import { ButtonsSearch } from "./ButtonsSearch";
import LocationType from "./LocationType";
import Price from "./Price";
import Surface from "./Surface";
import ShortTermSearchFields from "components/searchBar/ShortTermSearchFields";

import { useRouteFlags } from "contexts/RouteProvider";


const SearchBar = () => {
  /**
   * The SearchBar component is a functional component that renders a search bar for the listings page.
   * It contains a form with input fields for the search query, the sale type, the type, the price, and the surface.
   * It also contains a submit button that sends a request to the API with the search parameters.
   * @returns {JSX.Element} - The JSX for the component.
  */

  const [filters, setFilters] = useState({
    saleType: "sale",
    type: "",
    price: { min: "", max: "" },
    surface: { min: "", max: "" },
    regionId: "",
    countyId: "",
    municipalityId: "",
    amenities: [],
    bedrooms: { min: "", max: "" },
    constructionYear: { min: "", max: "" },
    floor: { min: "", max: "" },
    heating_system: "",
    startDate: "",
    endDate: "",
  });

  const history = useHistory();
  const [update, setUpdate] = useState(false);
  const location = history.location;
  const [errors, setErrors] = useState("");
  const [empty, setEmpty] = useState(false);
  const { regionsData } = useFetchLocationData();
  const { shortTermListings } = useRouteFlags();
  

  // Fetch the search parameters from the URL and set the state.
  useMemo(() => {
    const search = history.location.search;

    const params = new URLSearchParams(search);
    const filters = {
      saleType: params.get("sale_type"),
      type: params.get("type"),
      price: { min: params.get("min_price"), max: params.get("max_price") },
      surface: { min: params.get("min_surface"), max: params.get("max_surface") },
      regionId: params.get("region_id"),
      countyId: params.get("county_id"),
      municipalityId: params.get("municipality_id"),
      amenities: params.getAll('amenities') || [],
      bedrooms: { min: params.get('min_bedrooms'), max: params.get('max_bedrooms') },
      constructionYear: { min: params.get('min_construction_year'), max: params.get('max_construction_year') },
      floor: { min: params.get('min_floor'), max: params.get('max_floor') },
      heating_system: params.get('heating_system'),
      startDate: params.get('start_date'),
      endDate: params.get('end_date'),
    };
    setFilters(filters);
    setUpdate(false);
  }, [history.location.search]);


  // Submit the search form.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fetch the listings from the API using the search parameters.
    let path = shortTermListings ? `/short-term-listings/?` : `/listings/?sale_type=${filters.saleType}`;
    if (filters.municipalityId) {
      path += `&region_id=${filters.regionId}&county_id=${filters.countyId}&municipality_id=${filters.municipalityId}`;
    }
    if (!filters.municipalityId) {
      path = location.pathname === "/short-term-listings/" && !location.search
        ? `/short-term-listings/?`
        : `/listings/?sale_type=${filters.saleType}`;
    }
    if (filters.type) {
      path += `&type=${filters.type}`;
    }
    if (filters.price.min) {
      path += `&min_price=${filters.price.min}`;
    }
    if (filters.price.max) {
      path += `&max_price=${filters.price.max}`;
    }
    if (filters.surface.min) {
      path += `&min_surface=${filters.surface.min}`;
    }
    if (filters.surface.max) {
      path += `&max_surface=${filters.surface.max}`;
    }
    if (filters.bedrooms.min) {
      (path += `&min_bedrooms=${filters.bedrooms.min}`);
    }
    if (filters.bedrooms.max) {
      (path += `&max_bedrooms=${filters.bedrooms.max}`);
    }
    if (filters.constructionYear.min) {
      (path += `&min_construction_year=${filters.constructionYear.min}`);
    }
    if (filters.constructionYear.max) {
      (path += `&max_construction_year=${filters.constructionYear.max}`);
    }
    if (filters.floor.min) {
      (path += `&min_floor=${filters.floor.min}`);
    }
    if (filters.floor.max) {
      (path += `&max_floor=${filters.floor.max}`);
    }
    if (filters.heating_system) {
      (path += `&heating_system=${filters.heating_system}`);
    }
    if (filters.amenities.length > 0) {
      filters.amenities.forEach((amenity) => {
        path += `&amenities=${amenity}`;
      });
    }
    if (filters.startDate) {
      path += `&start_date=${filters.startDate}`;
    }
    if (filters.endDate) {
      path += `&end_date=${filters.endDate}`;
    }

    try {
      const { data } = await axiosReq.get(`${path}`);
      history.push(`${path}`, { data: data });
    } catch (err) {
      // console.log(err);
      if (err.response.status === 400) {
        setErrors("Please select one option");
      }
    }
  };

  // Update the button label if the search parameters are not empty.
  useEffect(() => {
    const updateButtonLabel = () => {
      if (
        location.pathname === "/listings/" &&
        (filters.saleType ||
          filters.municipalityId ||
          filters.type ||
          filters.price.min ||
          filters.price.max ||
          filters.surface.min ||
          filters.surface.max
          || filters.bedrooms.min ||
          filters.bedrooms.max ||
          filters.constructionYear.min ||
          filters.constructionYear.max ||
          filters.floor.min ||
          filters.floor.max ||
          filters.heating_system ||
          filters.amenities.length > 0)
      ) {
        setUpdate(true);
      } else {
        setUpdate(false);
      }
    };
    updateButtonLabel();
  }, [
    update,
    filters.municipalityId,
    filters.type,
    filters.price.min,
    filters.price.max,
    filters.surface.min,
    filters.surface.max,
    filters.saleType,
    location.pathname,
    filters.bedrooms.min,
    filters.bedrooms.max,
    filters.constructionYear.min,
    filters.constructionYear.max,
    filters.floor.min,
    filters.floor.max,
    filters.heating_system,
    filters.amenities,
  ]);

  const handleMunicipalitySelect = (municipality) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      regionId: municipality.region_id,
      countyId: municipality.county_id,
      municipalityId: municipality.id,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilters = (filters) => {
    setFilters(filters);
  };

  return (
    <Container className="mb-5" style={{ fontSize: "0.8rem" }}>
      <Form
        className={shortTermListings ? `${styles.SearchFormShortTerm}` : `${styles.SearchForm}`}
        onSubmit={handleSubmit}
      >
        <Row className="align-items-center justify-content-center">
          {errors &&
            (setTimeout(() => setErrors(""), 3000),
              (
                <Alert className={styles.ErrorWidth} variant="warning">
                  {errors}
                </Alert>
              ))}
          <Row className="mb-1 align-items-center justify-content-start gx-0 gx-md-1">
            <Col xs={6} className={shortTermListings ? "d-none" : "mb-1"}>
              <SaleTypeSearch
                errors={errors}
                setErrors={setErrors}
                filters={filters}
                setFilters={setFilters}
                handleChange={handleChange}
              />
            </Col>


            <Col xs={shortTermListings ? 12 : 6} className="mb-1 d-flex align-items-center justify-content-end">
              <AdvancedFiltersModal
                onApplyFilters={handleFilters}
                filters={filters}
                setFilters={setFilters}
                handleSubmit={handleSubmit}
                update={update}
                empty={empty}
                setEmpty={setEmpty}
                regionsData={regionsData}
                history={history}
                handleMunicipalitySelect={handleMunicipalitySelect}
              />
            </Col>
          </Row>

          {!shortTermListings && (
            <Row className="g-1">
              <Col xs={12} md={6} lg={7} xl={6} className="mb-1">
                <LocationType
                  filters={filters}
                  setFilters={setFilters}
                  onSearch={handleMunicipalitySelect}
                  regionsData={regionsData}
                  history={history}
                  empty={empty}
                  setEmpty={setEmpty}
                  handleChange={handleChange}
                />
              </Col>

              <Col xs={12} md={12} lg={12} xl={6} className="mb-1 d-none d-md-block">
                <Row className="g-1 align-items-center justify-content-evenly justify-content-lg-start">
                  <Price
                    filters={filters}
                    setFilters={setFilters}
                  />
                  <Surface
                    filters={filters}
                    setFilters={setFilters}
                  />
                </Row>
              </Col>

              <Col xs={12} lg={12} className="pt-3 d-flex align-items-center justify-content-lg-end">
                <ButtonsSearch
                  filters={filters}
                  setFilters={setFilters}
                  update={update}
                />
              </Col>

            </Row>
          )}

          {shortTermListings && (

            <ShortTermSearchFields
              filters={filters}
              setFilters={setFilters}
              handleChange={handleChange}
              handleMunicipalitySelect={handleMunicipalitySelect}
              regionsData={regionsData}
              history={history}
              empty={empty}
              setEmpty={setEmpty}
              update={update}
              onSearch={handleSubmit}
            />

          )}
        </Row>
      </Form >
    </Container >
  );
};

export default SearchBar;
