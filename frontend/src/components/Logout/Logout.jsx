import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiLogoutUser } from "../../apiControllers/authApiController";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await apiLogoutUser();
      } finally {
        navigate("/login", { replace: true });
      }
    };

    logout();
    console.log("LOGOUT PLACEHOLDER");
  }, [navigate]);

  return null;
};

export default Logout;
