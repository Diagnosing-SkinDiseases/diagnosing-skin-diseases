import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const MFAVerifyForm = () => {
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  // Extract userId from token on mount
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/api/user/mfa/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, token: code }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Verification failed");

      setMessage("✅ MFA verified! Proceeding...");
      // You could redirect the user or unlock app access here
    } catch (err) {
      console.error(err.message);
      setMessage("❌ Invalid code. Please try again.");
    }
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

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default MFAVerifyForm;
