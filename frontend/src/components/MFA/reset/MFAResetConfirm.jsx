import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiUrl from "../../../api";
import { useAuth } from "../../App/AuthContext";

const MFAResetConfirm = () => {
  const [message, setMessage] = useState("Processing your MFA reset...");
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const { login } = useAuth();
  const navigate = useNavigate();
  const hasRun = useRef(false); // prevent double run in StrictMode

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const controller = new AbortController();

    const confirmReset = async () => {
      if (!resetToken) {
        setMessage("❌ Invalid or missing reset token.");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/user/mfa/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: resetToken }),
          signal: controller.signal,
        });

        const data = await response.json();

        // Treat idempotent "already reset" as success
        if (response.ok) {
          login(data.token);
          setMessage("✅ MFA has been reset. Redirecting to setup...");
          setTimeout(() => navigate("/mfa-setup"), 1200);
        } else {
          setMessage(`❌ ${data.error || "Reset failed"}`);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Reset error:", err);
        setMessage(`❌ ${err.message || "Network error"}`);
      }
    };

    confirmReset();

    return () => controller.abort();
  }, [resetToken, login, navigate]);

  return (
    <div className="login-card">
      <p>{message}</p>
      {!resetToken && <a href="/login">Return to Login</a>}
    </div>
  );
};

export default MFAResetConfirm;
