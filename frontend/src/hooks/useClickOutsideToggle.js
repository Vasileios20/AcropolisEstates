import { useEffect, useRef, useState } from "react";

const useClickOutsideToggle = () => {
  /**
   * This hook is used to toggle a component when a user clicks outside of it.
   * It returns a ref to the component, a boolean value to indicate whether the
   * component is expanded, and a function to set the expanded value.
   * @returns {Object} - The ref, expanded, and setExpanded values.
   */

  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    // Close the component when the user clicks outside of it.
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mouseup", handleClickOutside);
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]);
  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;
