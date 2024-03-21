import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import RootNodeSection from "./RootNodeInput";
import "./AdminCreateTrees.css";
import { useState, useEffect } from "react";
import EditTreeTitle from "./EditTreeTitle";
import NodeArea from "./NodeArea";

const rootNodeDefault = {
  currentId: "node1",
  content: "Is it sunny?",
  parentId: null,
  noChild: [],
  yesChild: [],
};

let counter = 2;

function generateNodeId() {
  return `node${counter++}`;
}

function generateNode() {
  const newId = generateNodeId(); // Generate a new unique ID for the "noChild" node
  const newNode = {
    currentId: newId,
    content: "New noChild node content",
    parentId: null,
    noChild: [],
    yesChild: [],
  };
  return newNode;
}

const addNoChild = (rootNode, targetNodeId, nodeToInsert) => {
  const addNoChildToTarget = (node) => {
    if (node.currentId === targetNodeId) {
      nodeToInsert.parentId = targetNodeId;
      return {
        ...node,
        noChild: [...node.noChild, nodeToInsert],
      };
    }
    // Recursively process both noChild and yesChild arrays
    const updatedNoChild = node.noChild.map(addNoChildToTarget);
    const updatedYesChild = node.yesChild.map(addNoChildToTarget);

    return {
      ...node,
      noChild: updatedNoChild,
      yesChild: updatedYesChild,
    };
  };
  const updatedRootNode = addNoChildToTarget(rootNode);
  return updatedRootNode;
};

const addYesChild = (rootNode, targetNodeId, nodeToInsert) => {
  const addYesChildToTarget = (node) => {
    if (node.currentId === targetNodeId) {
      nodeToInsert.parentId = targetNodeId;
      return {
        ...node,
        yesChild: [...node.yesChild, nodeToInsert],
      };
    }
    // Recursively process both noChild and yesChild arrays
    const updatedNoChild = node.noChild.map(addYesChildToTarget);
    const updatedYesChild = node.yesChild.map(addYesChildToTarget);

    return {
      ...node,
      noChild: updatedNoChild,
      yesChild: updatedYesChild,
    };
  };
  const updatedRootNode = addYesChildToTarget(rootNode);
  return updatedRootNode;
};

const deleteChild = (rootNode, nodeIdToDelete) => {
  const deleteNodeRecursively = (node) => {
    if (node.currentId === nodeIdToDelete) {
      return null;
    }
    const updatedNoChild = node.noChild.map(deleteNodeRecursively);
    const updatedYesChild = node.yesChild.map(deleteNodeRecursively);
    return {
      ...node,
      noChild: updatedNoChild.filter(Boolean),
      yesChild: updatedYesChild.filter(Boolean),
    };
  };

  const updatedRootNode = deleteNodeRecursively(rootNode);
  return updatedRootNode;
};

const updateNodeContent = (rootNode, nodeIdToUpdate, newContent) => {
  const updateContentRecursively = (node) => {
    if (node.currentId === nodeIdToUpdate) {
      return { ...node, content: newContent };
    }

    // Recursively process both noChild and yesChild arrays
    const updatedNoChild = node.noChild.map(updateContentRecursively);
    const updatedYesChild = node.yesChild.map(updateContentRecursively);

    return {
      ...node,
      noChild: updatedNoChild,
      yesChild: updatedYesChild,
    };
  };

  const updatedRootNode = updateContentRecursively(rootNode);
  return updatedRootNode;
};

// console.log("post", addNoChild(rootNodeDefault));
// console.log("delete", deleteNoChild(addNoChild(), "node2"));
// console.log("post", addYesChild(rootNodeDefault));
// console.log("delete", deleteYesChild(addYesChild(), "node3"));
// console.log("pre", rootNodeDefault);

let test1 = rootNodeDefault;
let node2 = generateNode();
let node3 = generateNode();
let node4 = generateNode();
let node5 = generateNode();
let node6 = generateNode();
let node7 = generateNode();

console.log(node6.currentId);

test1 = addNoChild(test1, "node1", node2);
test1 = addYesChild(test1, "node1", node5);
test1 = addNoChild(test1, "node5", node3);
test1 = addYesChild(test1, "node2", node6);
test1 = addNoChild(test1, "node3", node4);
test1 = addYesChild(test1, "node6", node7);

test1 = deleteChild(test1, "node6");
test1 = updateNodeContent(test1, "node3", "Test");

// console.log("test1", test1);

const AdminCreateTree = () => {
  // Title state
  const [title, setTitle] = useState("");

  // Node State
  const [rootNode, setRootNode] = useState({
    currentId: "node0",
    content: "",
    parentId: null,
    noChild: [],
    yesChild: [],
  });

  useEffect(() => {
    console.log(title);
    console.log(rootNode);
  }, [title, rootNode]);

  return (
    <>
      <div className="content-section">
        <div className="title-section">
          <EditTreeTitle title={title} setTitle={setTitle}></EditTreeTitle>
          <NodeArea rootNode={rootNode} setRootNode={setRootNode}></NodeArea>
        </div>
        <div className="button-container">
          <button className="btn btn-primary btn-sm rounded-pill">
            Preview
          </button>
          <button className="btn btn-primary btn-sm rounded-pill">Add</button>
          <button className="btn btn-primary btn-sm rounded-pill">
            Add & Publish
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminCreateTree;
