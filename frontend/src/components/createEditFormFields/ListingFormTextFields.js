import React, { useState } from "react";


import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import styles from "../../styles/ListingCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";

import ResidentialFields from "./ResidentialFields";

import { useTranslation } from "react-i18next";
import useFetchOwners from "../../hooks/useFetchOwners";
import { useRouteFlags } from "contexts/RouteProvider";
import LandFields from "components/createEditFormFields/LandFields";
import CommercialFields from "components/createEditFormFields/CommercialFields";
import ShortTermFields from "components/createEditFormFields/ShortTermFields";
import AgentOwner from "components/createEditFormFields/Owner";
import TypeSaleSub from "components/createEditFormFields/TypeSaleSub";
import CurrencyPrice from "components/createEditFormFields/CurrencyPriceAvailability";
import Description from "components/createEditFormFields/Description";
import LocationFields from "components/createEditFormFields/LocationFields";
import { ApprovedFeatureCheckbox } from "components/createEditFormFields/ApprovedFeatureCheckbox";

const ListingTextFields = (
  {
    listingData,
    setListingData,
    handleChange,
    history,
    errors,
    create,
    handleAmenityChange,
    selectedAmenities,
    edit,
    onRegionChange,
    onCountyChange,
    onMunicipalityChange,
    selectedRegion,
    selectedCounty,
    selectedMunicipality
  }) => {

  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { owners } = useFetchOwners();
  const { shortTermListing } = useRouteFlags();


  const renderTextField = (fieldName, label, type = "text", rows = 1) => (
    <Form.Group controlId={fieldName}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className={styles.Input}
        type={type}
        name={fieldName}
        value={listingData[fieldName]}
        onChange={handleChange}
        as={type === "textarea" ? "textarea" : undefined}
        rows={rows}
      />
      {errors?.[fieldName]?.map((message, idx) => (
        <Alert className={styles.Input} variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
    </Form.Group>
  );

  const handleChecked = (e) => {
    handleChange({
      target: {
        name: e.target.name,
        value: e.target.checked,
      },
    });
  };

  return (
    <div className="text-center">
      <h2>{t("createEditForm.headers.basicInfo")}</h2>
      <AgentOwner
        listingData={listingData}
        handleChange={handleChange}
        handleShow={handleShow}
        handleClose={handleClose}
        show={show}
        owners={owners}
        errors={errors}
      />
      {!shortTermListing && <TypeSaleSub
        listingData={listingData}
        handleChange={handleChange}
        handleShow={handleShow}
        handleClose={handleClose}
        show={show}
        owners={owners}
        errors={errors}
        t={t}
      />}
      <CurrencyPrice
        listingData={listingData}
        handleChange={handleChange}
        handleShow={handleShow}
        handleClose={handleClose}
        show={show}
        owners={owners}
        errors={errors}
        t={t}
      />
      
      <hr />

      <Description
        listingData={listingData}
        handleChange={handleChange}
        handleShow={handleShow}
        handleClose={handleClose}
        show={show}
        owners={owners}
        errors={errors}
        t={t}
      />

      <hr />
   
        <LocationFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          onRegionChange={onRegionChange}
          onCountyChange={onCountyChange}
          onMunicipalityChange={onMunicipalityChange}
          selectedRegion={selectedRegion}
          selectedCounty={selectedCounty}
          selectedMunicipality={selectedMunicipality}
          renderTextField={renderTextField}
          t={t}
        />

      <hr />

      {/* // RESIDENTIAL FIELDS */}

      {listingData.type === "residential" &&
        <ResidentialFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
          handleAmenityChange={handleAmenityChange}
          selectedAmenities={selectedAmenities}
          create={create}
        />
      }

      {/* // LAND FIELDS */}

      {listingData.type === "land" &&
        <LandFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
          handleAmenityChange={handleAmenityChange}
          selectedAmenities={selectedAmenities}
          create={create}
        />
      }

      {/* // COMMERCIAL FIELDS */}

      {listingData.type === "commercial" &&
        <CommercialFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
          handleAmenityChange={handleAmenityChange}
          selectedAmenities={selectedAmenities}
          create={create}
        />
      }

      {/* // SHORT TERM FIELDS */}

      {shortTermListing &&
        <ShortTermFields
          listingData={listingData}
          handleChange={handleChange}
          errors={errors}
          renderTextField={renderTextField}
          handleAmenityChange={handleAmenityChange}
          selectedAmenities={selectedAmenities}
          create={create}
        />
      }

      <hr />


      <ApprovedFeatureCheckbox
        listingData={listingData}
        handleChange={handleChange}
        handleChecked={handleChecked}
        handleShow={handleShow}
        handleClose={handleClose}
        show={show}
        owners={owners}
        errors={errors}
        t={t}
      />

      <Button
        className={`${btnStyles.Button} ${btnStyles.Remove} m-3`}
        onClick={() => history.goBack()}
      >
        {t("createEditForm.button.cancel")}
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.AngryOcean} m-3`} type="submit">
        {create ? t("createEditForm.button.create") : t("createEditForm.button.update")}
      </Button>
    </div>
  );
};

export default ListingTextFields;
