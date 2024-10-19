import React from "react";
import {
  AdvancedMarker,
  Pin,
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";

const MapMarker = ({ setShowCookieBanner, nonEssentialConsent, ...props }) => {
  /**
   * The MapMarker component is a functional component that renders a map marker.
   * It receives the following props:
   * - lat: number
   * - lng: number
   * @returns {JSX.Element}
   * - The JSX for the component.
   * @param {object} props - The props for the component.
   * @param {number} props.lat - The latitude of the marker.
   * @param {number} props.lng - The longitude of the marker.
   * @returns {JSX.Element} - The JSX for the component.
   */

  // Gets the API key from the environment variables
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const latitude = props.latitude;
  const longitude = props.longitude;
  const hasCookieConsent = () => {
    const cookieConsent = document.cookie;
    if (cookieConsent === "nonEssentialCookies=true") {
      return true;
    }
    return false;
  }

  return (
    <>
      {nonEssentialConsent ? (
        <APIProvider apiKey={API_KEY} libraries={["marker"]}>
          <Map
            mapId={"bf51a910020fa25a"}
            defaultZoom={13}
            defaultCenter={{
              lat: latitude,
              lng: longitude,
            }}
            gestureHandling={"greedy"}
            // disableDefaultUI
            style={{ width: "100%", height: "350px" }}
          >
            <AdvancedMarker
              position={{
                lat: latitude,
                lng: longitude,
              }}
              title={"AdvancedMarker with customized pin."}
            >
              <Pin
                background={"#32cd12"}
                borderColor={"#1e89a1"}
                glyphColor={"#0f677a"}
              ></Pin>
            </AdvancedMarker>
          </Map>
        </APIProvider>
      ) : (
        <div className="text-center">
          <h5>Enable cookies to view map</h5>
          <p onClick={() => setShowCookieBanner("show")} style={{ cursor: "pointer" }}>Click here to enable cookies</p>
        </div>
      )}
    </>
  );
};

export default MapMarker;
