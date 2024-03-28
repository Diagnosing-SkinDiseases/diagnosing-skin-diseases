import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./styles/AdminCreateTrees.css";
import { useState, useEffect } from "react";
import EditTreeTitle from "./EditTreeTitle";
import NodeArea from "./NodeArea";
import { apiCreateTree } from "../../../../apiControllers/treeApiController";

const AdminCreateTree = ({ existingTree, existingTitle, setTreePayload }) => {
  // Title state
  const [title, setTitle] = useState(existingTitle !== "" ? existingTitle : "");

  // Node State
  const [rootNode, setRootNode] = useState(
    existingTree !== null
      ? existingTree
      : {
          currentId: "node0",
          content: "",
          parentId: null,
          noChild: [],
          yesChild: [],
        }
  );

  // Image State
  // AboutLink state

  // Publish handler
  const publishHandler = () => {
    function flattenAllNodes(node) {
      if (!node) {
        return null;
      }

      const flattenedNode = {
        ...node,
        yesChild:
          node.yesChild && node.yesChild.length > 0
            ? flattenAllNodes(node.yesChild[0])
            : null,
        noChild:
          node.noChild && node.noChild.length > 0
            ? flattenAllNodes(node.noChild[0])
            : null,
      };

      return flattenedNode;
    }

    let treePayload = flattenAllNodes(rootNode);

    let payload = {
      name: title,
      nodeTree: treePayload,
      about: "Sample",
      status: "published",
    };
    console.log(payload);
    apiCreateTree(payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (existingTree) {
      console.log("Edit mode");
    } else {
      console.log("Add mode");
    }
    console.log("existing", existingTree);
    console.log(title);
    console.log(rootNode);

    function flattenAllNodes(node) {
      if (!node) {
        return null;
      }

      const flattenedNode = {
        ...node,
        yesChild:
          node.yesChild && node.yesChild.length > 0
            ? flattenAllNodes(node.yesChild[0])
            : null,
        noChild:
          node.noChild && node.noChild.length > 0
            ? flattenAllNodes(node.noChild[0])
            : null,
      };

      return flattenedNode;
    }

    let treePayload = flattenAllNodes(rootNode);

    let payload = {
      name: title,
      nodeTree: treePayload,
      about: "Sample",
      status: "published",
    };
    console.log("payload", payload);
    setTreePayload(payload);
    console.log("payload set");
  }, [title, rootNode]);

  return (
    <>
      <div className="content-section">
        <div className="title-section">
          <EditTreeTitle title={title} setTitle={setTitle}></EditTreeTitle>
          <div>
            <h3>About Article Link</h3>
          </div>
          <div>
            <h3>Tree Cover Image</h3>
          </div>
          <NodeArea rootNode={rootNode} setRootNode={setRootNode}></NodeArea>
        </div>
      </div>
    </>
  );
};

export default AdminCreateTree;
