import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUrl from "../../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login", { replace: true });
          return;
        }

        setChecked(true);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    checkAuth();

    console.log("AUTH PLACEHOLDER");
  }, [navigate]);

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export default AuthContext;
