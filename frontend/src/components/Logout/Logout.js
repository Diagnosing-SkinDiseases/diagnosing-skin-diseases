import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App/AuthContext";

/**
 * Logout Component
 *
 * This component handles the logout process by invoking the logout function from the AuthContext
 * and then redirecting the user to the login page. It uses the useEffect hook to execute the
 * logout and navigation actions as soon as the component mounts. Since this component is solely
 * responsible for side effects (logout and redirect), it does not render any visible content.
 *
 * Context:
 *   useAuth: Hook to access the logout function from AuthContext, which handles the cleanup
 *   of user authentication tokens and any other necessary logout procedures.
 *
 * Navigation:
 *   useNavigate: Hook for programmatically navigating to other routes. In this case, it is used
 *   to redirect the user to the login page after successful logout.
 *
 * Effect:
 *   useEffect is used to execute the logout function and navigation immediately after component
 *   mounts, ensuring the user is logged out and redirected only once.
 */
const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Perform logout by clearing user authentication details
    navigate("/login"); // Redirect user to the login page after logout
  }, [logout, navigate]);

  return null; // This component does not render anything
};

export default Logout;
