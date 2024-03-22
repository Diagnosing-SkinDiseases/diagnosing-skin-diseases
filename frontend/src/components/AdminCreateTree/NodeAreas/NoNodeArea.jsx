import React from "react";
import styles from "../styles/styles";
import NodeEditor from "./NodeEditor";

const NoNodeArea = ({ rootNode, setRootNode, idCounter, setIdCounter }) => {
  // Recursive function to render "no" nodes
  const renderNoNodes = (node) => {
    function collectNoNodes(node) {
      let noNodes = [];

      // If the current node has "no" children, add them to the array and explore further
      if (node.noChild && node.noChild.length > 0) {
        node.noChild.forEach((child) => {
          noNodes.push(child);
          // Recursively collect "no" nodes from this child
          noNodes = noNodes.concat(collectNoNodes(child));
        });
      }

      // Also explore the "yes" children of the current node for any "no" children they might have
      if (node.yesChild && node.yesChild.length > 0) {
        node.yesChild.forEach((child) => {
          // Only explore further; don't add the "no" nodes themselves
          noNodes = noNodes.concat(collectNoNodes(child));
        });
      }

      return noNodes;
    }

    let noNodes = collectNoNodes(node);
    noNodes.sort((a, b) => {
      // Assuming currentId is a string
      return a.currentId.localeCompare(b.currentId);
    });

    console.log("No nodes: ", noNodes);
    return noNodes.map((node, index) => {
      return (
        <NodeEditor
          key={node.currentId}
          rootNode={rootNode}
          setRootNode={setRootNode}
          currentNode={node}
          idCounter={idCounter}
          setIdCounter={setIdCounter}
        ></NodeEditor>
      );
    });
  };
  return (
    <div style={styles.nodeContainer} className="root-node-section-container">
      <h3>No Nodes</h3>
      {renderNoNodes(rootNode)}
    </div>
  );
};

export default NoNodeArea;
