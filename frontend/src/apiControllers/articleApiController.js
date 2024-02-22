import axios from "axios";
import apiUrl from "../api";
/**
 * Creates a promise for getting all articles from the database. \
 * See comments inside function for the format of payloads.
 *
 * @returns the promise for the api response
 */
const apiGetAllArticles = () => {
  /*
    Response payload format: 
    [
    {
    _id: String,
    title: String,
    content: [{
        type: Enum String (ArticleContentType)
        content: String
    }],
    status: Enum String (Status)
    }
    ]
  */
  return axios.get(`${apiUrl}/article/read/all`);
};

/**
 * Creates a promise for creating an article for the database. \
 * See comments inside function for the format of payloads.
 *
 * @param {*} payload - the payload for the post request as an object
 * @returns the promise for the api response
 */
const apiCreateArticle = (payload) => {
  /*
    Request payload format: 
    {
    title: String,
    content: [{
        type: Enum String (ArticleContentType)
        content: String
    }],
    status: Enum String (Status)
    }
  */
  return axios.post(`${apiUrl}/article/create`, payload);
};

/**
 * Creates a promise for deleting an article for the database. \
 * See comments inside function for the format of payloads.
 *
 * @param {*} targetId - the _id of the target article as a string
 * @returns - the promise for the api response
 */
const apiDeleteArticle = (targetId) => {
  /*
    Response payload format: 
    {
    _id: String,
    title: String,
    content: [{
        type: Enum String (ArticleContentType)
        content: String
    }],
    status: Enum String (Status)
    }
  */
  return axios.delete(`${apiUrl}/article/delete`, { data: { id: targetId } });
};

export { apiGetAllArticles, apiCreateArticle, apiDeleteArticle };
