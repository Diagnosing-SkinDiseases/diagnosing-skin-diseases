import React from "react";
import NodeEditor from "./NodeEditor";
import styles from "../styles/styles";

/**
 * RootNodeArea component displays the root node of a decision tree.
 * @param {Object} props - The props object containing properties passed to the component.
 * @param {Object} props.rootNode - The root node of the decision tree.
 * @param {Function} props.setRootNode - Function to set the root node of the decision tree.
 * @param {number} props.idCounter - The counter for generating unique node IDs.
 * @param {Function} props.setIdCounter - Function to set the counter for generating unique node IDs.
 * @param {Array} props.allNodes - Array containing all nodes in the decision tree.
 * @returns {JSX.Element} - Returns the JSX element for the RootNodeArea component.
 */
const RootNodeArea = ({
  rootNode,
  setRootNode,
  idCounter,
  setIdCounter,
  allNodes,
}) => {
  return (
    <div style={styles.nodeContainer} className="root-node-section-container">
      <h3>Root Node</h3>
      {/* NodeEditor component for editing the root node */}
      <NodeEditor
        rootNode={rootNode}
        setRootNode={setRootNode}
        currentNode={rootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
        allNodes={allNodes}
      />
    </div>
  );
};

export default RootNodeArea;
