import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useHistory } from "react-router-dom";

/**
 * The CaretDown component is a functional component that renders a caret down icon for a dropdown.
 * @param {function} onClick - The function to handle the click event.
 * @returns {JSX.Element} - The JSX for the component.
 */

const CaretDown = React.forwardRef(({ onClick }, ref) => (
  <i
    className={`fas fa-square-caret-down ${styles.DropdownCaret}`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

/**
 * The MoreDropdown component is a functional component that renders a dropdown for editing or deleting a listing.
 * @param {function} handleEdit - The function to handle editing the listing.
 * @param {function} handleDelete - The function to handle deleting the listing.
 * @returns {JSX.Element} - The JSX for the component.
 */

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown className="ml-auto" drop="left">
      <Dropdown.Toggle as={CaretDown} />

      <Dropdown.Menu
        className="text-center"
        popperConfig={{ strategy: "fixed" }}
      >
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleEdit}
          aria-label="edit"
        >
          <i className="fas fa-edit" />
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleDelete}
          aria-label="delete"
        >
          <i className="fas fa-trash-alt" />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

/**
 * The ProfileEditDropdown component is a functional component that renders a dropdown for editing the user's profile.
 * @param {number} id - The id of the user's profile.
 * @returns {JSX.Element} - The JSX for the component.
 */

export function ProfileEditDropdown({ id }) {
  const history = useHistory();
  return (
    <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
      <Dropdown.Toggle as={CaretDown} />
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit`)}
          aria-label="edit-profile"
        >
          <i className="fas fa-edit" /> edit profile
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label="edit-username"
        >
          <i className="far fa-id-card" /> change username
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label="edit-password"
        >
          <i className="fas fa-key" /> change password
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
