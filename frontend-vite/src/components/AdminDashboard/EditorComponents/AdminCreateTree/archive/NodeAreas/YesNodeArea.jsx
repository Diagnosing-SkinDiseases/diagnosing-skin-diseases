import React from "react";
import styles from "../styles/styles";
import NodeEditor from "./NodeEditor";

/**
 * YesNodeArea component displays all "yes" nodes in a decision tree.
 * @param {Object} props - The props object containing properties passed to the component.
 * @param {Object} props.rootNode - The root node of the decision tree.
 * @param {Function} props.setRootNode - Function to set the root node of the decision tree.
 * @param {number} props.idCounter - The counter for generating unique node IDs.
 * @param {Function} props.setIdCounter - Function to set the counter for generating unique node IDs.
 * @param {Array} props.allNodes - Array containing all nodes in the decision tree.
 * @returns {JSX.Element|null} - Returns the JSX element for the YesNodeArea component if there are "yes" nodes, otherwise returns null.
 */
const YesNodeArea = ({
  rootNode,
  setRootNode,
  idCounter,
  setIdCounter,
  allNodes,
}) => {
  /**
   * Function to collect all "yes" nodes from a given node in the decision tree.
   * @param {Object} node - The current node in the decision tree.
   * @returns {Array} - Array containing all "yes" nodes.
   */
  function collectYesNodes(node) {
    let yesNodes = [];

    if (node.yesChild && node.yesChild.length > 0) {
      node.yesChild.forEach((child) => {
        if (child.parentId === node.currentId) {
          yesNodes.push(child);
        }
        yesNodes = yesNodes.concat(collectYesNodes(child));
      });
    }

    if (node.noChild && node.noChild.length > 0) {
      node.noChild.forEach((child) => {
        yesNodes = yesNodes.concat(collectYesNodes(child));
      });
    }

    return yesNodes;
  }

  /**
   * Function to render all "yes" nodes recursively.
   * @param {Object} node - The current node in the decision tree.
   * @returns {JSX.Element[]} - Array of JSX elements representing the "yes" nodes.
   */
  const renderYesNodes = (node) => {
    let yesNodes = collectYesNodes(node);
    yesNodes.sort((a, b) => {
      const idA = parseInt(a.currentId.replace("node", ""));
      const idB = parseInt(b.currentId.replace("node", ""));
      return idA - idB;
    });

    return yesNodes.map((node, index) => {
      return (
        <NodeEditor
          key={node.currentId}
          rootNode={rootNode}
          setRootNode={setRootNode}
          currentNode={node}
          idCounter={idCounter}
          setIdCounter={setIdCounter}
          allNodes={allNodes}
        ></NodeEditor>
      );
    });
  };

  return (
    collectYesNodes(rootNode).length !== 0 && (
      <div style={styles.nodeContainer} className="root-node-section-container">
        <h3>Yes Nodes</h3>
        {renderYesNodes(rootNode)}
      </div>
    )
  );
};

export default YesNodeArea;
