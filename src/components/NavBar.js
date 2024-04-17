import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import useUserStatus from "../hooks/useUserStatus";
import logo from "../assets/logo.png";
import { removeTokenTimestamp } from "../utils/utils";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useTranslation } from "react-i18next";

const NavBar = () => {
  /**
   * The NavBar component is a functional component that renders the navigation bar of the application.
   * It contains links to the home page, the listings page, the about page, the contact page,
   * the sign in page, the sign up page, the user's profile page, and the sign out page.
   */
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const userStatus = useUserStatus();
  const { expanded, setExpanded, ref } = useClickOutsideToggle();
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lng = navigator.language || navigator.userLanguage;
    i18n.changeLanguage(lng);
    const isMobileDevice = /Mobi/i.test(window.navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, [i18n]);

  const hanleServicesClick = () => {
    if (isMobile) {
      setServicesExpanded(!servicesExpanded);
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
      id="basic-nav-dropdown"
      show={servicesExpanded}
      onMouseEnter={() => setServicesExpanded(true)}
      onMouseLeave={() => setServicesExpanded(false)}
      onClick={hanleServicesClick}
    >
      <NavDropdown.Item href="/propertyManagement">
        {t("services.assetManagement")}
      </NavDropdown.Item>
      <NavDropdown.Item href="/advisory">
        {t("services.financialAdvice")}
      </NavDropdown.Item>
      <NavDropdown.Item href="/evaluation">
        {t("services.valuation")}
      </NavDropdown.Item>
      <NavDropdown.Item href="/listings">
        {t("services.properties")}
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
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/listings/create"
      >
        {t("nav.addListing")}
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/contact_list"
      >
        {t("nav.messages")}
      </NavLink>
      {servicesDropdown}
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar
          src={currentUser?.profile_image}
          text={currentUser?.username}
          height={25}
        />
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        Sign out
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img
              src={logo}
              alt="logo"
              height={45}
              style={{ borderRadius: "50%" }}
            ></img>
          </Navbar.Brand>
        </NavLink>

        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav" className={styles.flecGrow}>
          <Nav className="ml-auto text-left">
            <NavLink
              exact
              className={styles.NavLink}
              activeClassName={styles.Active}
              to="/"
            >
              {t("nav.home")}
            </NavLink>

            {userStatus ? staffIcons : userIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
