import axios from "axios";
import apiUrl from "../api";

/**
 * Creates a promise for getting all trees from the database. \
 * See comments inside function for the format of payloads.
 *
 * @returns the promise for the api response
 */
const apiGetAllTrees = () => {
  /*
    Response payload format: 
    [
      {
        _id: String
        name: String,
        nodes: [
          {
            currentId: String
            content: String
            parentId: String
            noChildId: String
            yesChildId: String
            _id: String
          }
        ],
        about: String
        status: Enum String (Status)
      }
    ]
  */
  return axios.get(`${apiUrl}/tree/read/all`);
};

/**
 * Creates a promise for creating an tree for the database. \
 * See comments inside function for the format of payloads.
 *
 * @param {*} payload - the payload for the post request as an object
 * @returns the promise for the api response
 */
const apiCreateTree = (payload) => {
  /*
    Note:
    Node = {
      currentId: String 
      content: String
      parentId: String
      noChild: Node
      yesChild: Node
    }

    Request payload format: 
      {
        name: String,
        nodeTree:
          {
            currentId: String
            content: String
            parentId: String?
            noChild: Node?
            yesChildId: Node?
          }
        ],
        about: String
        status: Enum String (Status)
      }
  */
  return axios.post(`${apiUrl}/tree/create`, payload);
};

/**
 * Creates a promise for deleting an tree for the database. \
 * See comments inside function for the format of payloads.
 *
 * @param {*} targetId - the _id of the target tree as a string
 * @returns - the promise for the api response
 */
const apiDeleteTree = (targetId) => {
  /*
    Response payload format: 
    {
      _id: String
      name: String,
      nodes: [
        {
          currentId: String
          content: String
          parentId: String
          noChildId: String
          yesChildId: String
          _id: String
        }
      ],
      about: String
      status: Enum String (Status)
    }
  */
  return axios.delete(`${apiUrl}/tree/delete`, {
    data: { id: targetId },
  });
};

export { apiGetAllTrees, apiCreateTree, apiDeleteTree };
