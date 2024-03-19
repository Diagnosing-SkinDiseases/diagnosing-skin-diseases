import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App/AuthContext";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return null; // This component does not render anything
};

export default Logout;
