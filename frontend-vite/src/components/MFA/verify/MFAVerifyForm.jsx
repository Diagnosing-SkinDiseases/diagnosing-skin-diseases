import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import apiUrl from "../../../api";

const MFAVerifyForm = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/admin/trees";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await axios.post(
        `${apiUrl}/user/mfa/verify`,
        { code },
        { withCredentials: true }
      );

      setMessage("✅ MFA verified! Redirecting…");

      // Let cookie propagate, then navigate
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 300);
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid code. Please try again.");
    }
  };

  return (
    <div className="login-card">
      <h2>MFA Verification</h2>

      <form onSubmit={handleSubmit}>
        <p>Enter the 6-digit code from your authenticator app:</p>

        <label htmlFor="mfa-code">Authentication Code:</label>
        <input
          type="text"
          id="mfa-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          pattern="\d{6}"
          maxLength={6}
          placeholder="123456"
        />

        <button type="submit">Verify & Continue</button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        <a href="/mfa-reset" style={{ fontSize: "0.85rem" }}>
          Reset MFA for lost device
        </a>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
};

export default MFAVerifyForm;
