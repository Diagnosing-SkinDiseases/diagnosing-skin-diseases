import React from "react";
import NodeEditor from "./NodeEditor";
import styles from "../styles/styles";
import { useEffect } from "react";

// style={styles.nodeContainer}
const RootNodeArea = ({ rootNode, setRootNode }) => {
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
          nodeId={rootNode.currentId}
        ></NodeEditor>
      </div>
    </>
  );
};

export default RootNodeArea;
