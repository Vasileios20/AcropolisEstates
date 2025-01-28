import { Suspense, useState } from "react";
import Container from "react-bootstrap/Container";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import { Route, Switch, useLocation, Link } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import ListingCreateForm from "./pages/listings/ListingCreateForm";
import ListingPage from "./pages/listings/ListingPage";
import ListingEditForm from "./pages/listings/ListingEditForm";
import ListingsPage from "./pages/listings/ListingsPage";
import HomePage from "./pages/home/HomePage";
import useUserStatus from "./hooks/useUserStatus";
import NotFound from "./pages/errors/NotFound";
import Forbidden403 from "./pages/errors/Forbidden403";
import ContactMessagesList from "./pages/contact/ContactMessagesList";
import ContactMessage from "./pages/contact/ContactMessage";
import ProfilePage from "./pages/profiles/ProfilePage";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import UsernameForm from "./pages/profiles/UsernameForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import AboutPage from "./pages/home/AboutPage";
import FinancialAdvicePage from "./pages/services/AdvisoryPage"
import AssetMgm from "./pages/services/AssetManagementPage";
import ValuationPage from "./pages/services/ValuationPage";
import Footer from "./components/Footer";
import ContactPage from "./pages/contact/ContactPage";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import Terms from "./pages/legal/Terms";
import AdminPage from "./pages/admin/AdminPage";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation, Trans } from "react-i18next";
import AdminListings from "./pages/admin/AdminListings";
import AdminOwners from "./pages/admin/AdminOwners";
import Owner from "./pages/admin/Owner";
import OwnerCreateFormPage from "./pages/admin/OwnerCreateFormPage";
import OwnerEditForm from "./pages/admin/OwnerEditForm";


function App() {
  useUserStatus();
  const location = useLocation();
  const path = location.pathname;
  const [cookieConsent, setCookieConsent] = useState(getCookieConsentValue("cookieConsent"));
  const [showCookieBanner, setShowCookieBanner] = useState("byCookieValue");
  const [nonEssentialConsent, setNonEssentialConsent] = useState(getCookieConsentValue("nonEssentialCookies") === "true");
  const { t } = useTranslation();

  if (cookieConsent === "false") {
    setCookieConsent(false);
  }

  if (
    path === "/listings/" ||
    path === "/privacyPolicy" ||
    path === "/terms"
  ) {
    styles.Main = styles.MainListings;
  } else {
    styles.Main = styles.MainHome;
  }

  return (
    <HelmetProvider>
      <Suspense fallback="loading">
        <div className={styles.App}>
          <NavBar />
          <Container fluid className={styles.Main}>
            <Switch>
              <Route exact path="/" render={() => <HomePage />} />
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route exact path="/about" render={() => <AboutPage />} />
              <Route
                exact
                path="/advisory"
                render={() => <FinancialAdvicePage />}
              />
              <Route
                exact
                path="/assetManagement"
                render={() => <AssetMgm />}
              />
              <Route exact path="/valuation" render={() => <ValuationPage />} />
              <Route exact path="/contact" render={() => <ContactPage />} />
              <Route
                exact
                path="/contact_list"
                render={() => <ContactMessagesList />}
              />
              <Route
                exact
                path="/contact_list/:id"
                render={() => <ContactMessage />}
              />
              <Route exact path="/listings" render={() => <ListingsPage nonEssentialConsent={nonEssentialConsent} setShowCookieBanner={setShowCookieBanner} />} />
              <Route
                exact
                path="/listings/create"
                render={() => <ListingCreateForm />}
              />
              <Route exact path="/listings/:id" render={() => <ListingPage setShowCookieBanner={setShowCookieBanner} nonEssentialConsent={nonEssentialConsent} />} />
              <Route
                exact
                path="/listings/:id/edit"
                render={() => <ListingEditForm />}
              />
              <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
              <Route
                exact
                path="/profiles/:id/edit"
                render={() => <ProfileEditForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/username"
                render={() => <UsernameForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/password"
                render={() => <UserPasswordForm />}
              />
              <Route exact path="/privacyPolicy" render={() => <PrivacyPolicy />} />
              <Route exact path="/terms" render={() => <Terms />} />
              <Route exact path="/forbidden" render={() => <Forbidden403 />} />
              <Route exact path="/frontend/admin" render={() => <AdminPage />} />
              <Route exact path="/frontend/admin/listings" render={() => <AdminListings />} />
              <Route exact path="/frontend/admin/listings/owners" render={() => <AdminOwners />} />
              <Route exact path="/frontend/admin/listings/owners/create" render={() => <OwnerCreateFormPage />} />
              <Route exact path="/frontend/admin/listings/owners/:id/edit" render={() => <OwnerEditForm />} />

              <Route exact path="/frontend/admin/listings/owners/:id" render={() => <Owner />} />
              <Route exact path="/notfound" render={() => <NotFound />} />
              <Route render={() => <NotFound />} />

            </Switch>
          </Container>
          <Footer />
          <>
            <CookieConsent
              location="bottom"
              buttonText={t("cookies.acceptAll")}
              declineButtonText={t("cookies.decline")}
              enableDeclineButton
              visible={showCookieBanner}
              onAccept={() => {
                setNonEssentialConsent(true);
                setShowCookieBanner("hidden");
                document.cookie = "nonEssentialCookies=true; path=/; max-age=31536000";
              }}
              onDecline={() => {
                setNonEssentialConsent(false);
                setShowCookieBanner("hidden");
                document.cookie = "nonEssentialCookies=false; path=/; max-age=31536000";
              }}
              cookieName="nonEssentialCookies"
              containerClasses="d-flex justify-content-center align-items-center"
              contentClasses={`${styles.CookieBannerContent} m-0 ps-1 pt-1`}
              buttonWrapperClasses={`${styles.CookieBannerButtonWrapper} m-0`}
              buttonClasses="m-0 me-1"

            >
              {t("cookies.content")} <Trans i18nKey="cookies.learnMore" components={{
                1: <Link to="/privacyPolicy" style={{ color: '#fefefe', textDecoration: 'underline' }} />
              }} />
            </CookieConsent>
            <div className={styles.CookieReset}><i onClick={() => {
              setShowCookieBanner("show");
            }} className="fa-solid fa-link"></i>
            </div>
          </>
        </div>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
