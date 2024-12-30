import React, { useEffect, useState } from "react";
import {
  AdvancedMarker,
  Pin,
  APIProvider,
  Map,
} from "@vis.gl/react-google-maps";

const MapMarker = ({ setShowCookieBanner, nonEssentialConsent, ...props }) => {
  /**
   * The MapMarker component renders a map marker.
   * Props:
   * - latitude: number
   * - longitude: number
   */

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const latitude = props.latitude;
  const longitude = props.longitude;

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load the Google Maps script when consent is provided
    if (nonEssentialConsent && API_KEY && latitude && longitude) {
      setIsMapLoaded(true);
    } else {
      setIsMapLoaded(false);
    }
  }, [nonEssentialConsent, API_KEY, latitude, longitude]);

  return (
    <>
      {isMapLoaded ? (
        <APIProvider apiKey={API_KEY} libraries={["marker"]}>
          <Map
            mapId={"bf51a910020fa25a"}
            defaultZoom={13}
            defaultCenter={{
              lat: latitude,
              lng: longitude,
            }}
            gestureHandling={"greedy"}
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
                background={"#847c3d"}
                borderColor={"#847c3d"}
                glyphColor={"#fff"}
              />
            </AdvancedMarker>
          </Map>
        </APIProvider>
      ) : (
        <div className="text-center">
          <h5>Enable cookies to view the map</h5>
          <p
            onClick={() => setShowCookieBanner("show")}
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            Click here to enable cookies
          </p>
        </div>
      )}
    </>
  );
};

export default MapMarker;
