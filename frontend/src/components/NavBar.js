import React, { useEffect, useState, useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import useUserStatus from "../hooks/useUserStatus";
import logo from "../assets/logo.png";
import { removeTokenTimestamp } from "../utils/utils";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";
import LanguageContext from '../contexts/LanguageContext';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const userStatus = useUserStatus();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [listingsExpanded, setListingsExpanded] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scroll, setScroll] = useState(false);
  const { changeLanguage } = useContext(LanguageContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, [i18n]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 1) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }, []);

  const handleServicesClick = () => {
    if (isMobile) {
      setServicesExpanded(!servicesExpanded);
      setExpanded(true);
    }
  };

  const handleListingsClick = () => {
    if (isMobile) {
      setListingsExpanded(!listingsExpanded);
      setExpanded(true);
    }
  };

  const handleAdminClick = () => {
    if (isMobile) {
      setAdminExpanded(!adminExpanded);
      setExpanded(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      // console.log(err);
    }
  };

  const servicesDropdown = (
    <NavDropdown
      className={`${styles.Navdropdown}`}
      title={t("services.title")}
      id="services-dropdown"
      show={servicesExpanded}
      onMouseEnter={() => setServicesExpanded(true)}
      onMouseLeave={() => setServicesExpanded(false)}
      onClick={handleServicesClick}
    >
      <NavDropdown.Item className={styles.NavDropdownItem} href="/assetManagement">
        {t("services.assetManagement")}
      </NavDropdown.Item>
      <NavDropdown.Item className={styles.NavDropdownItem} href="/advisory">
        {t("services.financialAdvice")}
      </NavDropdown.Item>
      <NavDropdown.Item className={styles.NavDropdownItem} href="/valuation">
        {t("services.valuation")}
      </NavDropdown.Item>
      <NavDropdown.Item className={styles.NavDropdownItem} href="/listings">
        {t("services.properties")}
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item className={styles.NavDropdownItem} href="/short-term-listings/">
        {t("services.shortTermRentals")}
      </NavDropdown.Item>
    </NavDropdown>
  );

  const listingsDropdown = (
    <NavDropdown
      className={`${styles.Navdropdown}`}
      title={t("nav.listings")}
      id="listings-dropdown"
      show={listingsExpanded}
      onMouseEnter={() => setListingsExpanded(true)}
      onMouseLeave={() => setListingsExpanded(false)}
      onClick={handleListingsClick}
    >
      <NavDropdown.Header>{t("nav.regularListings")}</NavDropdown.Header>
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/listings/create"
      >
        ➕ {t("nav.addListing")}
      </NavDropdown.Item>
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/listings/"
      >
        ✓ {t("nav.viewAllListings")}
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Header>{t("nav.shortTermRentals")}</NavDropdown.Header>
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/short-term-listings/create"
      >
        ➕ {t("nav.addRental")}
      </NavDropdown.Item>
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/short-term-listings/"
      >
        ✓ {t("nav.viewAllRentals")}
      </NavDropdown.Item>
    </NavDropdown>
  );

  const adminDropdown = (
    <NavDropdown
      className={`${styles.Navdropdown}`}
      title={t("nav.admin")}
      id="admin-dropdown"
      show={adminExpanded}
      onMouseEnter={() => setAdminExpanded(true)}
      onMouseLeave={() => setAdminExpanded(false)}
      onClick={handleAdminClick}
    >
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/bookings"
      >
        {t("nav.bookings")}
      </NavDropdown.Item>
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/listings/owners"
      >
        {t("nav.owners")}
      </NavDropdown.Item>
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/contact_list"
      >
        {t("nav.messages")}
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/listings"
      >
        {t("nav.allListings")}
      </NavDropdown.Item>
      <NavDropdown.Item
        className={styles.NavDropdownItem}
        href="/frontend/admin/short-term-listings"
      >
        {t("nav.allShortTerm")}
      </NavDropdown.Item>
    </NavDropdown>
  );

  const userIcons = (
    <>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/about"
      >
        {t("nav.about")}
      </NavLink>
      {servicesDropdown}
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/contact"
      >
        {t("nav.contact")}
      </NavLink>
    </>
  );

  const staffIcons = (
    <>
      {listingsDropdown}
      {adminDropdown}
      <hr />
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        {currentUser?.username}
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        {t("nav.logout")}
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={scroll ? `${styles.NavBarScroll}` : expanded ? `${styles.NavBarMobile}` : `${styles.NavBar}`}
      expand="md"
      fixed="top"
      id="navBar"
    >
      <Container>
        {!userStatus && <NavLink to="/">
          <Navbar.Brand>
            <img
              src={logo}
              alt="logo"
              className={userStatus ? styles.NavLogoAdmin : styles.NavLogo}
            />
          </Navbar.Brand>
        </NavLink>}

        <Navbar.Toggle
          ref={ref}
          onClick={() => {
            setExpanded(!expanded);
            document.getElementById("navBar").classList.add(`${styles.NavBarMobile}`);
          }}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav" className={`${styles.flecGrow} ms-auto`}>
          <Nav className="ms-auto text-left">
            {userStatus ? (
              <NavLink
                exact
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/frontend/admin"
              >
                {t("nav.dashboard")}
              </NavLink>
            ) : (
              <NavLink
                exact
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/"
              >
                {t("nav.home")}
              </NavLink>
            )}

            {userStatus ? staffIcons : userIcons}
          </Nav>
          <div className={`${styles.LngBtnContainer} d-md-none d-flex`}>
            <button type="submit" onClick={() => changeLanguage('el')} className={`${styles.LngBtn} ${styles.LngBtnGR}`} />
            <button type="submit" onClick={() => changeLanguage('en')} className={`${styles.LngBtn} ${styles.LngBtnEN}`} />
          </div>
        </Navbar.Collapse>
      </Container>
      <div className={`${styles.LngBtnContainer} d-none d-md-flex`}>
        <button type="submit" onClick={() => changeLanguage('el')} className={`${styles.LngBtn} ${styles.LngBtnGR}`} />
        <button type="submit" onClick={() => changeLanguage('en')} className={`${styles.LngBtn} ${styles.LngBtnEN}`} />
      </div>
    </Navbar>
  );
};

export default NavBar;
