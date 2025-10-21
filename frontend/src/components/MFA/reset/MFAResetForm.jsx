// MFAResetForm.jsx
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App/AuthContext";

import apiUrl from "../../../api";

const MFAResetForm = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  // Extract userId from token
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.userId);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  // Send reset request to backend
  const handleSendReset = async () => {
    try {
      const response = await fetch(`${apiUrl}/user/mfa/reset/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Reset request failed");

      setMessage("✅ Reset link sent to your registered email.");
    } catch (err) {
      console.error("Reset error:", err);
      setMessage("❌ Error sending reset email. Please try again later.");
    }
  };

  const handleBack = () => {
    navigate("/mfa-verify");
  };

  return (
    <div className="login-card">
      <h2>MFA Reset</h2>

      <p>
        If you lost access to your authenticator app, you can send a one-time
        reset link to your registered email. (You can’t change the email address
        here.)
      </p>

      <button type="button" onClick={handleSendReset}>
        Send Reset Email
      </button>

      {message && <p>{message}</p>}

      <div style={{ marginTop: "1rem" }}>
        <button type="button" onClick={handleBack}>
          Back to 2FA
        </button>
      </div>
    </div>
  );
};

export default MFAResetForm;
