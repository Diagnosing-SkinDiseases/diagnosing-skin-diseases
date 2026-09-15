import AdminCreateTree from "./AdminCreateTree/AdminCreateTree";
import React from "react";
import { useEffect, useState } from "react";
import { apiGetTree } from "../../../apiControllers/treeApiController";

/**
 * Tree component renders the tree creation form for creating or editing a decision tree.
 * @param {Object} props - The props object containing properties passed to the component.
 * @param {string} props.existingId - The ID of the existing tree to edit, if applicable.
 * @param {Function} props.setTreePayload - Function to set the payload of the tree.
 * @returns {JSX.Element} - Returns the JSX element for the Tree component.
 */
const Tree = ({ existingId, setTreePayload }) => {
  const [existingTree, setExistingTree] = useState(null);
  const [existingTitle, setExistingTitle] = useState("");
  const [existingAboutLink, setExistingAboutLink] = useState("");
  const [existingCoverImage, setExistingCoverImage] = useState("");
  const [existingMidOffsets, setExistingMidOffsets] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  /**
   * Renders the appropriate content based on the existence of an existing tree.
   * @returns {JSX.Element} - Returns the JSX element for the tree creation form.
   */
  const renderContent = () => {
    if (existingId) {
      return (
        dataLoaded && (
          <AdminCreateTree
            existingTitle={existingTitle}
            existingTree={existingTree}
            existingAboutLink={existingAboutLink}
            existingCoverImage={existingCoverImage}
            setTreePayload={setTreePayload}
            existingMidOffsets={existingMidOffsets}
            setExistingMidOffsets={setExistingMidOffsets}
          />
        )
      );
    } else {
      return (
        <AdminCreateTree
          existingTitle={""}
          existingTree={null}
          existingAboutLink={existingAboutLink}
          existingCoverImage={existingCoverImage}
          setTreePayload={setTreePayload}
          existingMidOffsets={existingMidOffsets}
          setExistingMidOffsets={setExistingMidOffsets}
        ></AdminCreateTree>
      );
    }
  };

  /**
   * Finds a node in the tree by its ID.
   * @param {Array} nodes - The array of nodes in the tree.
   * @param {string} nodeId - The ID of the node to find.
   * @returns {Object|string|null} - Returns the node object if found, otherwise returns the nodeId.
   */
  function findNodeById(nodes, nodeId) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].currentId === nodeId) {
        let match = nodes[i];
        return match;
      }
    }
    return nodeId;
  }

  /**
   * Finds the root node of the tree.
   * @param {Array} nodes - The array of nodes in the tree.
   * @returns {Object|null} - Returns an object containing the root node and the updated nodes array, or null if no root node is found.
   */
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

  /**
   * Replaces child IDs with corresponding child node objects.
   * @param {Array} nodes - The array of nodes in the tree.
   * @returns {Array} - Returns the array of nodes with child IDs replaced with child node objects.
   */
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

  /**
   * Inserts a node into the tree.
   * @param {Object} root - The root node of the tree.
   * @param {Object} newNode - The node to insert into the tree.
   */
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

  /**
   * Inserts nested child nodes into the tree.
   * @param {Object} root - The root node of the tree.
   * @param {Array} nodesList - The array of nodes in the tree.
   */
  function insertNested(root, nodesList) {
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

  /**
   * Creates a deep copy of an object or array.
   * @param {Object|Array} obj - The object or array to copy.
   * @returns {Object|Array} - Returns the deep copy of the object or array.
   */
  function deepCopy(obj) {
    if (Array.isArray(obj)) {
      return obj.map(deepCopy);
    } else if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, deepCopy(value)])
      );
    } else {
      return obj;
    }
  }

  /**
   * Converts a flat list of nodes into a nested tree structure.
   * @param {Array} nodes - The array of nodes representing the tree.
   * @returns {Object} - Returns the root node of the tree.
   */
  function fromList(nodes) {
    let nodesCopy = deepCopy(nodes);
    nodesCopy = replaceChildIds(nodesCopy);
    let { node: root, nodes: noRoot } = findRootNode(nodesCopy);
    nodesCopy = noRoot;

    while (nodesCopy.length !== 0) {
      let toInsertNode = nodesCopy[0];

      nodesCopy.splice(0, 1);
      insertNode(root, toInsertNode);
    }

    insertNested(root, nodes);
    return root;
  }

  /**
   * Converts a nested tree structure into a flat list of nodes.
   * @param {Object} node - The root node of the tree.
   * @returns {Object} - Returns the root node with all children nested within.
   */
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

  /**
   * useEffect hook to fetch the tree data from the API.
   */
  useEffect(() => {
    /**
     * Fetches the tree data from the API.
     */
    const getTree = async () => {
      if (existingId) {
        apiGetTree(existingId)
          .then((res) => {
            setExistingTree(toListAllChildren(fromList(res.data.nodes)));
            setExistingTitle(res.data.name);
            setExistingAboutLink(res.data.aboutLink);
            setExistingCoverImage(res.data.coverImage);
            setDataLoaded(true);
            setExistingMidOffsets(res.data.existingMidOffsets);
          })
          .catch((err) => {
            console.error("err", err);
          });
      }
    };

    getTree();
  }, []);

  return renderContent();
};

export default Tree;
