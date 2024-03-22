import React from "react";
import NodeEditor from "./NodeEditor";
import styles from "../styles/styles";
import { useEffect } from "react";

// style={styles.nodeContainer}
const RootNodeArea = ({
  rootNode,
  setRootNode,
  idCounter,
  setIdCounter,
  allNodes,
}) => {
  return (
    <>
      <div
        style={styles.nodeContainer}
        className="root-node-section-container "
      >
        <h3>Root Node</h3>
        <NodeEditor
          rootNode={rootNode}
          setRootNode={setRootNode}
          currentNode={rootNode}
          idCounter={idCounter}
          setIdCounter={setIdCounter}
          allNodes={allNodes}
        ></NodeEditor>
      </div>
    </>
  );
};

export default RootNodeArea;
