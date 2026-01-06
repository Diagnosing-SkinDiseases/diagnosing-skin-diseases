import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../api";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } finally {
        // Always redirect, even if the request fails
        navigate("/login", { replace: true });
      }
    };

    // logout();
    console.log("LOGOUT PLACEHOLDER");
  }, [navigate]);

  return null;
};

export default Logout;
