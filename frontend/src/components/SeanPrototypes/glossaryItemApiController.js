import axios from "axios";
import apiUrl from "../../api";

/**
 * Creates a promise for getting all glossaryItems from the database. \
 * See comments inside function for the format of payloads.
 *
 * @returns the promise for the api response
 */
const apiGetAllGlossaryItems = () => {
  /*
    Response payload format: 
    [
    {
    term: String,
    definition: String
    status: Enum String (Status)
    }
    ]
  */
  return axios.get(`${apiUrl}/glossaryItem/read/all`);
};

/**
 * Creates a promise for creating an glossaryItem for the database. \
 * See comments inside function for the format of payloads.
 *
 * @param {*} payload - the payload for the post request as an object
 * @returns the promise for the api response
 */
const apiCreateGlossaryItem = (payload) => {
  /*
    Request payload format: 
    {
    title: String,
    content: [{
        type: Enum String (GlossaryItemContentType)
        content: String
    }],
    status: Enum String (Status)
    }
  */
  return axios.post(`${apiUrl}/glossaryItem/create`, payload);
};

/**
 * Creates a promise for deleting an glossaryItem for the database. \
 * See comments inside function for the format of payloads.
 *
 * @param {*} targetId - the _id of the target glossaryItem as a string
 * @returns - the promise for the api response
 */
const apiDeleteGlossaryItem = (targetId) => {
  /*
    Response payload format: 
    {
    title: String,
    content: [{
        type: Enum String (GlossaryItemContentType)
        content: String
    }],
    status: Enum String (Status)
    }
  */
  return axios.delete(`${apiUrl}/glossaryItem/delete`, {
    data: { id: targetId },
  });
};

export { apiGetAllGlossaryItems, apiCreateGlossaryItem, apiDeleteGlossaryItem };
