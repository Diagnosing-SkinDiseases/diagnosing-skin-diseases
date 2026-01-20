import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiUrl from "../../../api";

const MFAResetForm = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendReset = async () => {
    setMessage("");

    try {
      await axios.post(
        `${apiUrl}/user/mfa/reset/email`,
        {},
        { withCredentials: true }
      );

      setMessage("✅ Reset link sent to your registered email.");
    } catch (err) {
      console.error(err);
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
        reset link to your registered email.
      </p>

      <button type="button" onClick={handleSendReset}>
        Send Reset Email
      </button>

      {message && <p>{message}</p>}

      <div style={{ marginTop: "1rem" }}>
        <button type="button" onClick={handleBack}>
          Back to MFA Verification
        </button>
      </div>
    </div>
  );
};

export default MFAResetForm;
