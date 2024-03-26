import axios from "axios";
import apiUrl from "../api";

/**
 * Creates a promise for creating a user in the database.
 * @param {*} payload - the payload for the post request as an object
 * @returns the promise for the api response
 */
const apiCreateUser = (payload) => {
  return axios.post(`${apiUrl}/user/create`, payload);
};

/**
 * Creates a promise for logging in a user.
 * @param {*} payload - the payload for the login request as an object
 * @returns the promise for the api response
 */
const apiLoginUser = (payload) => {
  return axios.post(`${apiUrl}/user/login`, payload);
};

/**
 * Creates a promise for getting all users from the database.
 * @returns the promise for the api response
 */
const apiGetAllUsers = () => {
  return axios.get(`${apiUrl}/user/read/all`);
};

/**
 * Creates a promise for getting a single user from the database.
 * @param {*} userId - the _id of the target user as a string
 * @returns the promise for the api response
 */
const apiGetUser = (userId) => {
  return axios.get(`${apiUrl}/user/read/?id=${userId}`);
};

/**
 * Creates a promise for updating a user in the database.
 * @param {*} payload - the payload for the update request as an object
 * @returns the promise for the api response
 */
const apiUpdateUser = (payload) => {
  return axios.patch(`${apiUrl}/user/update`, payload);
};

/**
 * Creates a promise for deleting a user from the database.
 * @param {*} userId - the _id of the target user to be deleted
 * @returns the promise for the api response
 */
const apiDeleteUser = (userId) => {
  return axios.delete(`${apiUrl}/user/delete?id=${userId}`);
};

export {
  apiCreateUser,
  apiLoginUser,
  apiGetAllUsers,
  apiGetUser,
  apiUpdateUser,
  apiDeleteUser,
};
