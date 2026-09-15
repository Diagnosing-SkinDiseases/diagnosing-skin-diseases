import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiUrl from "../../../api";

const MFASetupForm = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Request MFA setup from backend (session-based)
  useEffect(() => {
    const fetchMfaSetup = async () => {
      try {
        const res = await axios.post(
          `${apiUrl}/user/mfa/setup`,
          {},
          { withCredentials: true }
        );

        setQrCodeUrl(res.data.qrCodeUrl);
      } catch (err) {
        console.error(err);
        setMessage("Error setting up MFA. Please try again.");
      }
    };

    fetchMfaSetup();
  }, []);

  // Submit TOTP code to enable MFA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        `${apiUrl}/user/mfa/verify`,
        { code },
        { withCredentials: true }
      );

      setMessage("✅ MFA setup complete!");

      setTimeout(() => {
        navigate("/admin/trees", { replace: true });
      }, 300);
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid code. Try again.");
    }
  };

  return (
    <div className="login-card">
      {!qrCodeUrl ? (
        <p>Loading MFA setup…</p>
      ) : (
        <>
          <h2>MFA Setup</h2>

          <form onSubmit={handleSubmit}>
            <p>Scan this QR code with your authenticator app:</p>

            <img
              src={qrCodeUrl}
              alt="MFA QR Code"
              style={{ width: 200, height: 200 }}
            />

            <br />

            <label htmlFor="totp">Enter the 6-digit code from your app:</label>

            <input
              type="text"
              id="totp"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              pattern="\d{6}"
              maxLength={6}
              placeholder="123456"
            />

            <button type="submit">Verify & Enable MFA</button>

            {message && <p>{message}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default MFASetupForm;
