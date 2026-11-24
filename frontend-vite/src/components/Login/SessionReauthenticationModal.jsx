import LoginForm from "./LoginForm";
import "../CSS/Login.css";

const SessionReauthenticationModal = ({ expectedUserId, onReauthenticated }) => (
  <div
    role="presentation"
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      display: "grid",
      placeItems: "center",
      padding: "1rem",
      background: "rgba(0, 0, 0, 0.55)",
    }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reauthentication-title"
      style={{
        width: "min(100%, 440px)",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "1rem",
        borderRadius: "10px",
        background: "var(--login-container, white)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h2 id="reauthentication-title" style={{ textAlign: "center" }}>
        Reauthenticate
      </h2>
      <LoginForm
        expectedUserId={expectedUserId}
        onReauthenticated={onReauthenticated}
        embedded
      />
    </div>
  </div>
);

export default SessionReauthenticationModal;
