import { useEffect } from "react";
import { withRouter } from "react-router-dom";

const ScrollToTop = ({ children, location: { pathname } }) => {
  /**
   * The ScrollToTop component is a functional component that scrolls the window to the top of the page when the route changes.
   * @param {Object} children - The children of the component.
   * @param {Object} location - The location object from the router.
   * @returns {JSX.Element}
   * @returns {null}
   */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return children || null;
};

export default withRouter(ScrollToTop);
