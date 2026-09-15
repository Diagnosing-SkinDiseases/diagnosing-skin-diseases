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

        // Not authenticated
        if (res.status === 401) {
          setChecked(false);
          navigate("/login", { replace: true });
          return;
        }

        // ⚠️ Authenticated, but not fully authorized
        if (res.status === 403) {
          setChecked(false);
          const data = await res.json();

          if (data.error === "MFA_NOT_INITIALIZED") {
            navigate("/mfa-setup", { replace: true });
            return;
          }

          if (data.error === "MFA_REQUIRED") {
            navigate("/mfa-verify", { replace: true });
            return;
          }

          // Any other 403 → treat as auth failure
          navigate("/login", { replace: true });
          return;
        }

        // Any other unexpected failure
        if (!res.ok) {
          setChecked(false);
          navigate("/login", { replace: true });
          return;
        }

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
