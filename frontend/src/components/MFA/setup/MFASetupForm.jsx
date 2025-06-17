import React, { useState, useEffect } from "react";

const MFASetupForm = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [manualKey, setManualKey] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    // Simulate fetching QR code and manual key from server
    const fetchMfaSetup = async () => {
      // Replace this with real API call
      const response = await fakeFetchMfaSetup();
      setQrCodeUrl(response.qrCodeUrl);
      setManualKey(response.manualKey);
    };

    fetchMfaSetup();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Submit the TOTP code to backend for verification
    console.log("Verifying MFA code:", code);
    // await sendCodeToBackend(code);
  };

  return (
    <div className="login-card">
      <h2>MFA Setup</h2>
      <form onSubmit={handleSubmit}>
        {/* QR Code */}
        <div>
          <p>Scan this QR code with your authenticator app:</p>
          <div
            style={{
              width: "200px",
              height: "200px",
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              marginTop: "10px",
            }}
          >
            QR Code
          </div>
        </div>

        {/* Manual Key */}
        <div>
          <p>Or enter this code manually:</p>
          <code>{manualKey}</code>
        </div>

        {/* TOTP Input */}
        <div>
          <label htmlFor="totp">Enter the 6-digit code from your app:</label>
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

        {/* Submit Button */}
        <button type="submit">Verify & Enable MFA</button>
      </form>
    </div>
  );
};

// Simulated API response
const fakeFetchMfaSetup = async () => {
  return {
    qrCodeUrl: "https://via.placeholder.com/150", // Replace with real QR code image URL
    manualKey: "JBSWY3DPEHPK3PXP", // Replace with actual base32 secret
  };
};

export default MFASetupForm;
