import { useState } from "react";
import { useLocation } from "react-router-dom";
import apiUrl from "../../api";
import { apiLoginUser } from "../../apiControllers/authApiController";
import MFAVerifyForm from "../MFA/verify/MFAVerifyForm";
import MFASetupForm from "../MFA/setup/MFASetupForm";

const LoginForm = ({
  expectedUserId,
  onReauthenticated,
  embedded = false,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reauthenticationStep, setReauthenticationStep] = useState("login");

  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/trees";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await apiLoginUser({ username, password, expectedUserId });

      if (expectedUserId) {
        const authResponse = await fetch(`${apiUrl}/auth/me`, {
          credentials: "include",
        });

        if (authResponse.ok) {
          onReauthenticated();
          return;
        }

        const authResult = await authResponse.json().catch(() => ({}));
        if (authResult.error === "MFA_REQUIRED") {
          setReauthenticationStep("verify-mfa");
          return;
        }

        if (authResult.error === "MFA_NOT_INITIALIZED") {
          setReauthenticationStep("setup-mfa");
          return;
        }

        setErrorMessage("Unable to verify this session. Please try again.");
        return;
      }

      // Preserve the existing full-page login flow for normal sign-ins.
      window.location.href = from;
    } catch (error) {
      if (error.response) {
        const isInvalidCredentials =
          error.response.status === 401 || error.response.status === 400;
        const isAccountMismatch =
          error.response.data?.error === "REAUTH_ACCOUNT_MISMATCH";

        setErrorMessage(
          isAccountMismatch
            ? "Sign in with the administrator account that started this session."
            : isInvalidCredentials
              ? "Invalid credentials."
              : "Login failed.",
        );
      } else {
        setErrorMessage("The login service is currently unavailable.");
      }
    }
  };

  if (reauthenticationStep === "verify-mfa") {
    return (
      <MFAVerifyForm onVerified={onReauthenticated} embedded={embedded} />
    );
  }

  if (reauthenticationStep === "setup-mfa") {
    return <MFASetupForm onVerified={onReauthenticated} embedded={embedded} />;
  }

  return (
    <div className={`login-card${embedded ? " login-card-embedded" : ""}`}>
      {!embedded && <h2>Login</h2>}
      <form onSubmit={handleSubmit}>
        <input
          type="username"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">{embedded ? "Reauthenticate" : "Login"}</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default LoginForm;
