import React from "react";
import styles from "../styles/styles";
import NodeEditor from "./NodeEditor";

/**
 * NoNodeArea component displays all "no" nodes of a decision tree.
 * @param {Object} props - The props object containing properties passed to the component.
 * @param {Object} props.rootNode - The root node of the decision tree.
 * @param {Function} props.setRootNode - Function to set the root node of the decision tree.
 * @param {number} props.idCounter - The counter for generating unique node IDs.
 * @param {Function} props.setIdCounter - Function to set the counter for generating unique node IDs.
 * @param {Array} props.allNodes - Array containing all nodes in the decision tree.
 * @returns {JSX.Element|null} - Returns the JSX element for the NoNodeArea component or null if no "no" nodes exist.
 */
const NoNodeArea = ({
  rootNode,
  setRootNode,
  idCounter,
  setIdCounter,
  allNodes,
}) => {
  /**
   * Function to collect all "no" nodes recursively.
   * @param {Object} node - The current node being analyzed.
   * @returns {Array} - An array containing all "no" nodes found.
   */
  function collectNoNodes(node) {
    let noNodes = [];

    if (node.noChild && node.noChild.length > 0) {
      node.noChild.forEach((child) => {
        if (child.parentId === node.currentId) {
          noNodes.push(child);
        }
        noNodes = noNodes.concat(collectNoNodes(child));
      });
    }

    if (node.yesChild && node.yesChild.length > 0) {
      node.yesChild.forEach((child) => {
        noNodes = noNodes.concat(collectNoNodes(child));
      });
    }

    return noNodes;
  }

  /**
   * Recursive function to render "no" nodes.
   * @param {Object} node - The current node being rendered.
   * @returns {JSX.Element[]} - An array of JSX elements representing the rendered "no" nodes.
   */
  const renderNoNodes = (node) => {
    let noNodes = collectNoNodes(node);
    noNodes.sort((a, b) => {
      const idA = parseInt(a.currentId.replace("node", ""));
      const idB = parseInt(b.currentId.replace("node", ""));
      return idA - idB;
    });

    return noNodes.map((node, index) => {
      return (
        <NodeEditor
          key={node.currentId}
          rootNode={rootNode}
          setRootNode={setRootNode}
          currentNode={node}
          idCounter={idCounter}
          setIdCounter={setIdCounter}
          allNodes={allNodes}
        />
      );
    });
  };

  // Render NoNodeArea only if "no" nodes exist
  return (
    collectNoNodes(rootNode).length !== 0 && (
      <div style={styles.nodeContainer} className="root-node-section-container">
        <h3>No Nodes</h3>
        {renderNoNodes(rootNode)}
      </div>
    )
  );
};

export default NoNodeArea;
