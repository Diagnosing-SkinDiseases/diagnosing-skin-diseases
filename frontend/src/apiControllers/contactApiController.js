import axios from "axios";
import apiUrl from "../api";

// The controller that sends data to the backend
const contactFormController = async (payload) => {
  payload.append("_subject", "DSD Contact Form Submission");
  payload.append("_replyto", payload.get("email"));
  payload.delete("g-recaptcha-response");
    try {
    const response = await axios.post(process.env.REACT_APP_FORM_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error; // Re-throw the error for handling in calling function
  }
};


export { contactFormController };