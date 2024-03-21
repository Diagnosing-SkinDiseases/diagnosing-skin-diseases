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
        {rootNode.noChild.map((node, index) => (
          <NodeEditor
            key={index} // Ensure each NodeEditor has a unique key
            rootNode={node}
            setRootNode={setRootNode}
            nodeId={node.currentId}
          />
        ))}
      </div>
    </>
  );
};

export default NoNodeArea;
