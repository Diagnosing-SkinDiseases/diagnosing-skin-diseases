import { useState, useEffect } from "react";
import {
  apiGetAllTrees,
  apiCreateTree,
  apiDeleteTree,
  apiGetTree,
  apiUpdateTree,
} from "../../../apiControllers/treeApiController";

console.log("Rendering api tests");

const TreeApiTests = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const executeApi = async () => {
      let test;
      let targetId = "65cf3632790be1df5b052ce4";

      const createPayload = {
        name: "Rash",
        nodeTree: {
          currentId: "node1",
          content: "Is it sunny?",
          parentId: null,
          noChild: {
            currentId: "node2",
            content: "Is it sunny?",
            parentId: "node1",
            noChild: null,
            yesChild: {
              currentId: "node4",
              content: "Is it sunny?",
              parentId: "node2",
              noChild: null,
              yesChild: null,
            },
          },
          yesChild: {
            currentId: "node3",
            content: "Is it sunny?",
            parentId: "node1",
            noChild: null,
            yesChild: null,
          },
        },
        about: "Sample",
        status: "published",
      };

      const updatePayload = {
        id: targetId,
        name: "Update Browser One",
        nodeTree: {
          currentId: "node1",
          content: "Is it sunny?",
          parentId: null,
          noChild: {
            currentId: "node2",
            content: "Is it sunny?",
            parentId: "node1",
            noChild: null,
            yesChild: {
              currentId: "node4",
              content: "Is it sunny?",
              parentId: "node2",
              noChild: null,
              yesChild: null,
            },
          },
          yesChild: {
            currentId: "node3",
            content: "Is it sunny?",
            parentId: "node1",
            noChild: null,
            yesChild: null,
          },
        },
        about: "Sample",
        status: "published",
      };

      apiUpdateTree(updatePayload)
        .then((response) => {
          test = response.data;
          console.log("SUCCESS", test);
        })
        .catch((error) => {
          console.log("ERROR", error);
          test = error;
        });
      console.log("Api request sent");
    };

    executeApi();
  }, []);

  return <>{"Tree API Tests (Check console) A"}</>;
};

export default TreeApiTests;
