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
          credentials: "include",
        });

        console.log("Start");

        // Not authenticated
        if (res.status === 401) {
          navigate("/login", { replace: true });
          return;
        }

        console.log("Check 1");

        // Authenticated but MFA required
        if (res.status === 403) {
          const data = await res.json();
          if (data.error === "MFA_REQUIRED") {
            navigate("/mfa-verify", { replace: true });
            return;
          }
        }

        console.log("Check 2");

        // Any other unexpected failure
        if (!res.ok) {
          navigate("/login", { replace: true });
          return;
        }

        console.log("Check 3");

        // Auth OK
        setChecked(true);
      } catch {
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // 🔒 Block rendering until auth is resolved
  if (!checked) return null;

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export default AuthContext;
