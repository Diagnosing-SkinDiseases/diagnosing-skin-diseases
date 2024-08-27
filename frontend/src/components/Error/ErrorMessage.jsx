import React from "react";
import "../CSS/Error.css"; 

/**
 * ErrorMessage Component
 *
 * Displays an error or information message.
 *
 * Props:
 *   message (String): The message to display.
 */
function ErrorMessage({ message }) {
  return <p className="error-info-message">{message}</p>;
}

export default ErrorMessage;
