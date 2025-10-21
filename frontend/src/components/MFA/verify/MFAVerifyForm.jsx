import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

import { useLocation, useNavigate } from "react-router-dom";

import apiUrl from "../../../api";

const MFAVerifyForm = () => {
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/admin/trees";

  // Extract userId from token on mount
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Malformed token");

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(
          base64.length + ((4 - (base64.length % 4)) % 4),
          "="
        );
        const payload = JSON.parse(atob(padded));
        setUserId(payload.userId);
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/user/mfa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token: code }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Verification failed");

      // ✅ Save new token to cookie
      Cookies.set("token", data.token, { expires: 1 });

      // After successful verification
      setMessage("✅ MFA verified! Proceeding...");

      setTimeout(() => {
        window.location.href = from;
      }, 300);
    } catch (err) {
      console.error(err.message);
      setMessage("❌ Invalid code. Please try again.");
    }
  };

  // Handler for navigating to MFA Setup page
  const handleReEnableClick = (e) => {
    e.preventDefault();
    navigate("/mfa-setup");
  };

  return (
    <div className="login-card">
      <h2>MFA Verification</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Enter the 6-digit code from your authenticator app:</p>
        </div>

        <div>
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
        </div>

        <button type="submit">Verify & Continue</button>
      </form>

      {/* Small hyperlink to re-enable MFA */}
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        <a href="/mfa-setup" style={{ fontSize: "0.85rem" }}>
          Re-enable MFA with QR Code
        </a>

        <br></br>

        <a href="/mfa-reset" style={{ fontSize: "0.85rem" }}>
          Reset MFA for lost device
        </a>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
};

export default MFAVerifyForm;
