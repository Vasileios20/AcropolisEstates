import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";

// import i18n (needs to be bundled ;))
import "./i18n";
import { LanguageProvider } from "./contexts/LanguageContext";
import { RouteProvider } from "./contexts/RouteProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <LanguageProvider>
      <CurrentUserProvider>
        <RouteProvider>
          <App />
        </RouteProvider>
      </CurrentUserProvider>
    </LanguageProvider>
  </Router >

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
