import React from "react";
import styles from "../styles/styles";
import NodeEditor from "./NodeEditor";

const YesNodeArea = ({ rootNode, setRootNode, idCounter, setIdCounter }) => {
  // Recursive function to render "yes" nodes
  const renderYesNodes = (node) => {
    function collectYesNodes(node) {
      let yesNodes = [];

      // If the current node has "yes" children, add them to the array and explore further
      if (node.yesChild && node.yesChild.length > 0) {
        node.yesChild.forEach((child) => {
          yesNodes.push(child);
          // Recursively collect "yes" nodes from this child
          yesNodes = yesNodes.concat(collectYesNodes(child));
        });
      }

      // Also explore the "no" children of the current node for any "yes" children they might have
      if (node.noChild && node.noChild.length > 0) {
        node.noChild.forEach((child) => {
          // Only explore further; don't add the "no" nodes themselves
          yesNodes = yesNodes.concat(collectYesNodes(child));
        });
      }

      return yesNodes;
    }

    let yesNodes = collectYesNodes(node);
    yesNodes.sort((a, b) => {
      // Assuming currentId is a string
      return a.currentId.localeCompare(b.currentId);
    });

    console.log("Yes nodes: ", yesNodes);
    return yesNodes.map((node, index) => {
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
      <h3>Yes Nodes</h3>
      {renderYesNodes(rootNode)}
    </div>
  );
};

export default YesNodeArea;
