import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // ✅ add this!
import { useAuth } from "../../App/AuthContext";

import apiUrl from "../../../api";

const MFASetupForm = () => {
  const [userId, setUserId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate(); // ✅ add this

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

  // Request MFA setup from backend
  useEffect(() => {
    const fetchMfaSetup = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/mfa/setup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Setup failed");

        setQrCodeUrl(data.qrCodeUrl);
      } catch (err) {
        console.error(err.message);
        setMessage("Error setting up MFA. Please try again.");
      }
    };

    if (userId) fetchMfaSetup();
  }, [userId]);

  // Submit TOTP code to enable MFA
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/user/mfa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, token: code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed");

      // ✅ Save new token
      Cookies.set("token", data.token, { expires: 1 });

      // ✅ Update context so new flags are reflected immediately
      login(data.token);

      setMessage("✅ MFA setup complete!");
      setTimeout(() => {
        navigate("/admin/trees");
      }, 500);
    } catch (err) {
      console.error(err.message);
      setMessage("❌ Invalid code. Try again.");
    }
  };

  return (
    <div className="login-card">
      {!qrCodeUrl ? (
        <span>{"UNAUTHORIZED"}</span>
      ) : (
        <>
          <h2>MFA Setup</h2>
          <form onSubmit={handleSubmit}>
            {/* QR Code */}
            <div>
              <p>Scan this QR code with your authenticator app:</p>
              <img
                src={qrCodeUrl}
                alt="MFA QR Code"
                style={{ width: 200, height: 200 }}
              />
            </div>

            <br></br>

            {/* TOTP Input */}
            <div>
              <label htmlFor="totp">
                Enter the 6-digit code from your app:
              </label>
              <input
                type="text"
                id="totp"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                pattern="\d{6}"
                maxLength={6}
              />
            </div>

            <button type="submit">Verify & Enable MFA</button>

            {message && <p>{message}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default MFASetupForm;
