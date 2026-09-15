import axios from "axios";
import apiUrl from "../api";

/**
 * Creates a promise for logging in a user.
 * @param {*} payload - the payload for the login request as an object
 * @returns the promise for the api response
 */
const apiLoginUser = (payload) => {
  return axios.post(`${apiUrl}/auth/login`, payload, { withCredentials: true });
};

const apiLogoutUser = () => {
  return axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
};

export { apiLoginUser, apiLogoutUser };
