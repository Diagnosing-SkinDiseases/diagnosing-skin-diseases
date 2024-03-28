import AdminCreateTree from "./AdminCreateTree/AdminCreateTree";
import React from "react";
import { useEffect, useState } from "react";
import { apiGetTree } from "../../../apiControllers/treeApiController";

const Tree = ({ existingId }) => {
  const [existingTree, setExistingTree] = useState(null);
  const [existingTitle, setExistingTitle] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  const renderContent = () => {
    if (existingId) {
      return (
        dataLoaded && (
          <AdminCreateTree
            existingTitle={existingTitle}
            existingTree={existingTree}
          />
        )
      );
    } else {
      return (
        <AdminCreateTree
          existingTitle={""}
          existingTree={null}
        ></AdminCreateTree>
      );
    }
  };

  function findNodeById(nodes, nodeId) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].currentId === nodeId) {
        let match = nodes[i];
        return match;
      }
    }
    return nodeId;
  }

  function findRootNode(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].parentId === null) {
        let match = nodes[i];
        nodes.splice(i, 1);
        return { nodes, node: match };
      }
    }
    return null;
  }

  function replaceChildIds(nodes) {
    nodes.forEach((node) => {
      if (node.yesChildId) {
        node.yesChild = { currentId: node.yesChildId };
        delete node.yesChildId;
      }
      if (node.noChildId) {
        node.noChild = { currentId: node.noChildId };
        delete node.noChildId;
      }
    });
    return nodes;
  }

  function insertNode(root, newNode) {
    if (!root) {
      return newNode;
    }
    if (root.yesChild) {
      if (root.yesChild.currentId === newNode.currentId) {
        root.yesChild = newNode;
      }
    }

    if (root.noChild) {
      if (root.noChild.currentId === newNode.currentId) {
        root.noChild = newNode;
      }
    }

    if (root.yesChild) {
      insertNode(root.yesChild, newNode);
    }
    if (root.noChild) {
      insertNode(root.noChild, newNode);
    }
  }

  function insertNested(root, nodesList) {
    // console.log("Trigger");
    if (root.yesChild) {
      if (Object.keys(root.yesChild).length === 1) {
        root.yesChild = findNodeById(nodesList, root.yesChild.currentId);
      }
    }

    if (root.noChild) {
      if (Object.keys(root.noChild).length === 1) {
        root.noChild = findNodeById(nodesList, root.noChild.currentId);
      }
    }

    if (root.yesChild) {
      insertNested(root.yesChild, nodesList);
    }
    if (root.noChild) {
      insertNested(root.noChild, nodesList);
    }
  }

  function deepCopy(obj) {
    if (Array.isArray(obj)) {
      // If it's an array, create a new array and recursively deep copy its elements
      return obj.map(deepCopy);
    } else if (typeof obj === "object" && obj !== null) {
      // If it's an object, create a new object and recursively deep copy its properties
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, deepCopy(value)])
      );
    } else {
      // For primitive types, just return the value
      return obj;
    }
  }

  function fromList(nodes) {
    console.log("Original", nodes);
    let nodesCopy = deepCopy(nodes);
    nodesCopy = replaceChildIds(nodesCopy);
    let { node: root, nodes: noRoot } = findRootNode(nodesCopy);
    nodesCopy = noRoot;

    while (nodesCopy.length !== 0) {
      let toInsertNode = nodesCopy[0];
      // console.log("root", root);
      // console.log("new", toInsertNode);

      nodesCopy.splice(0, 1);
      insertNode(root, toInsertNode);
    }

    insertNested(root, nodes);
    return root;
  }

  function toListAllChildren(node) {
    if (!node) {
      return null;
    }

    delete node.yesChildId;
    delete node.noChildId;

    const wrappedNode = {
      ...node,
      yesChild: node.yesChild ? [toListAllChildren(node.yesChild)] : [],
      noChild: node.noChild ? [toListAllChildren(node.noChild)] : [],
    };

    return wrappedNode;
  }

  function prettifyJSON(jsonString) {
    try {
      const parsedObject = JSON.parse(jsonString);
      return JSON.stringify(parsedObject, null, 2);
    } catch (error) {
      console.error("Invalid JSON string:", error);
      return null;
    }
  }

  useEffect(() => {
    const getTree = async () => {
      if (existingId) {
        apiGetTree(existingId)
          .then((res) => {
            console.log("Success");
            setExistingTree(toListAllChildren(fromList(res.data.nodes)));
            setExistingTitle(res.data.name);
            setDataLoaded(true);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    };
    console.log(existingId);

    getTree();
  }, []);
  return renderContent();
};

export default Tree;
