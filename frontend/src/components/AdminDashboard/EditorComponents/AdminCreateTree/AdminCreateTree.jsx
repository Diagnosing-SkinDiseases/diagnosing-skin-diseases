import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./styles/AdminCreateTrees.css";
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

function printYesNodes(node) {
  // Check if the current node has "yes" children and print them
  if (node.yesChild && node.yesChild.length > 0) {
    node.yesChild.forEach((child) => {
      console.log(`Yes Node ID: ${child.currentId}, Content: ${child.content}`);
      // Recursively explore both "yes" and "no" children of this "yes" child
      printYesNodes(child);
    });
  }

  // Also explore the "no" children of the current node for any "yes" children they might have
  if (node.noChild && node.noChild.length > 0) {
    node.noChild.forEach((child) => {
      // Only explore further; don't print the "no" nodes themselves
      printYesNodes(child);
    });
  }
}

function collectYesNodes(node) {
  let yesNodes = [];

  // If the current node has "yes" children, add them to the array and explore further
  if (node.yesChild && node.yesChild.length > 0) {
    node.yesChild.forEach((child) => {
      yesNodes.push({ currentId: child.currentId, content: child.content });
      // Recursively collect "yes" nodes from this child
      yesNodes = yesNodes.concat(collectYesNodes(child));
    });
  }

  // Also explore the "no" children of the current node for any "yes" children they might have
  if (node.noChild && node.noChild.length > 0) {
    node.noChild.forEach((child) => {
      // Only explore further; don't add the "no" nodes themselves
      yesNodes = yesNodes.concat(collectYesNodes(child));
    });
  }

  return yesNodes;
}

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

// test1 = deleteChild(test1, "node6");
test1 = updateNodeContent(test1, "node3", "Test");

// console.log("test", test1);
// printYesNodes(test1);
// let myYesNodes = collectYesNodes(test1);
// console.log("Yes nodes:", myYesNodes);

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
      </div>
    </>
  );
};

export default AdminCreateTree;
