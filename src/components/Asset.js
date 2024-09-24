import React from "react";
import Spinner from "react-bootstrap/Spinner";
import styles from "../styles/Asset.module.css";

const Asset = ({ spinner, src, message }) => {
  /**
   * The Asset component is a functional component that renders an asset, such as an image or a spinner.
   * It contains a spinner, an image, or a message.
   * @param {boolean} spinner - A boolean that determines whether to show a spinner.
   * @param {string} src - The source URL for the image.
   * @param {string} message - The message to display.
   * @returns {JSX.Element}
   */

  return (
    <div className={`${styles.Asset} p-4`}>
      {spinner && <Spinner animation="border" />}
      {src && <img src={src} alt={message} />}
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default Asset;
