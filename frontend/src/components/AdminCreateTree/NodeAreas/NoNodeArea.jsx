import React from "react";
import styles from "../styles/styles";
import NodeEditor from "./NodeEditor";

const NoNodeArea = ({ rootNode, setRootNode }) => {
  return (
    <>
      <div
        style={styles.nodeContainer}
        className="root-node-section-container "
      >
        <h3>No Nodes</h3>
        <NodeEditor rootNode={rootNode} setRootNode={setRootNode}></NodeEditor>
      </div>
    </>
  );
};

export default NoNodeArea;
