import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./styles/AdminCreateTrees.css";
import { useState, useEffect } from "react";
import EditTreeTitle from "./EditTreeTitle";
import NodeArea from "./NodeArea";
import { apiCreateTree } from "../../../../apiControllers/treeApiController";

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

  // Publish handler
  const publishHandler = () => {
    let payload = {
      name: title,
      nodeTree: rootNode,
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
      <button onClick={publishHandler}>Publish</button>
    </>
  );
};

export default AdminCreateTree;
