import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiUrl from "../../../api";

const MFAResetConfirm = () => {
  const [message, setMessage] = useState("");
  const { userId } = useParams(); // or however you’re getting it

  useEffect(() => {
    console.log("Reset page loaded. userId param:", userId); // <--- ADD LOG

    const confirmReset = async () => {
      try {
        console.log("Sending reset request to backend...");
        console.log(userId);
        const response = await fetch(
          `${apiUrl}/user/mfa/reset?userId=${userId}`,
          { method: "POST" } // Important: use POST if your backend route expects POST
        );
        console.log("Response status:", response.status); // <--- ADD LOG

        const data = await response.json();
        console.log("Response data:", data); // <--- ADD LOG

        if (!response.ok) throw new Error(data.error || "Reset failed");
        setMessage("✅ MFA has been reset. Please set it up again.");
      } catch (err) {
        console.error("Reset error:", err);
        setMessage(`❌ ${err.message}`);
      }
    };

    confirmReset();
  }, [userId]);

  return (
    <div className="login-card">
      <p>{message}</p>
    </div>
  );
};

export default MFAResetConfirm;
