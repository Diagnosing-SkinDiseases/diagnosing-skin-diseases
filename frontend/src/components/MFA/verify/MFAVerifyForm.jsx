import React, { useState } from "react";

const MFAVerifyForm = () => {
  const [code, setCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Submit the code to your backend for verification
    console.log("Verifying MFA code:", code);
    // await verifyMfaCode(code);
  };

  return (
    <div className="login-card">
      <h2>MFA Verification</h2>
      <form onSubmit={handleSubmit}>
        {/* Instruction Text */}
        <div>
          <p>Enter the 6-digit code from your authenticator app:</p>
        </div>

        {/* TOTP Input */}
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

        {/* Submit Button */}
        <button type="submit">Verify & Continue</button>
      </form>
    </div>
  );
};

export default MFAVerifyForm;
