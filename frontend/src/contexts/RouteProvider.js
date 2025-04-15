import React, { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
    const location = useLocation();
    const path = location.pathname;
    const shortTermListing = path.includes("short-term-listings");

    return (
        <RouteContext.Provider value={{ shortTermListing }}>
            {children}
        </RouteContext.Provider>
    );
};

export const useRouteFlags = () => useContext(RouteContext);