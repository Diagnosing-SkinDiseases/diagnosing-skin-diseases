import React from "react";
import styles from "../styles/styles";
import NodeEditor from "./NodeEditor";

const YesNodeArea = ({ rootNode, setRootNode }) => {
  return (
    <>
      <div
        style={styles.nodeContainer}
        className="root-node-section-container "
      >
        <h3>Yes Nodes</h3>
        {rootNode.yesChild.map((node, index) => (
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

export default YesNodeArea;
