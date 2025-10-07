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

  const handleSendReset = async () => {
    console.log("Would trigger backend email to reset MFA for:", userId);
    setMessage(
      "A reset link has been sent to your registered email (if available)."
    );

    // In production you’d do:
    // try {
    //   const response = await fetch(`${apiUrl}/user/mfa/reset`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ userId }),
    //   });
    //   const data = await response.json();
    //   if (!response.ok) throw new Error(data.error || "Reset failed");
    //   setMessage("Reset link sent to your email.");
    // } catch (err) {
    //   console.error(err.message);
    //   setMessage("❌ Error sending reset email. Please try again.");
    // }
  };

  const handleBack = () => {
    console.log("Navigate back to MFA login");
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
