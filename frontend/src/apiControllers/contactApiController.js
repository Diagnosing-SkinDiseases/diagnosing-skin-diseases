import axios from "axios";
import apiUrl from "../api";

// The controller that sends data to the backend
const contactFormController = async (payload) => {
    try {
    console.log(JSON.stringify(payload));
    const response = await axios.post(`${apiUrl}/contactRouter`, payload, {
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