import { useEffect, useState } from "react";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { axiosReq } from "../api/axiosDefaults";

const useUserStatus = () => {
  /**
   * The useUserStatus hook is a custom hook that fetches the user status from the API.
   * @returns {String} - The user status.
   */

  const user = useCurrentUser();
  const [userStatus, setUserStatus] = useState("");

  const userId = user?.pk;

  useEffect(() => {
    // Fetch the user status from the API.
    const getUserStatus = async () => {
      try {
        const { data } = await axiosReq.get(`user_status/`);
        setUserStatus(data.staff_status.is_staff);
      } catch (err) {
        // console.log(err);
      }
    };
    getUserStatus();
  }, [userId]);
  return userStatus;
};

export default useUserStatus;
