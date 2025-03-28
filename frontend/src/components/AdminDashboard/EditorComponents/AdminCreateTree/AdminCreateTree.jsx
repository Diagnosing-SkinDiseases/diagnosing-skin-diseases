import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./styles/AdminCreateTrees.css";
import { useState, useEffect } from "react";
import EditTreeTitle from "./EditTreeTitle";
import NodeFlow from "./NodeFlow/NodeFlow";
import ArticleCover from "./ArticleCover";
import AboutLink from "./AboutLink";

/**
 * AdminCreateTree component allows creating or editing a decision tree in the admin panel.
 * @param {Object} props - The props object containing properties passed to the component.
 * @param {Object|null} props.existingTree - The existing tree data (null if creating a new tree).
 * @param {string} props.existingTitle - The existing title of the tree.
 * @param {string} props.existingCoverImage - The existing cover image URL of the tree.
 * @param {string} props.existingAboutLink - The existing about link of the tree.
 * @param {Function} props.setTreePayload - Function to set the tree payload.
 * @returns {JSX.Element} - Returns the JSX element for the AdminCreateTree component.
 */
const AdminCreateTree = ({
  existingTree,
  existingTitle,
  existingCoverImage,
  existingAboutLink,
  existingMidOffsets,
  setExistingMidOffsets,
  setTreePayload,
}) => {
  // Title state
  const [title, setTitle] = useState(existingTitle !== "" ? existingTitle : "");

  // Node State
  const [rootNode, setRootNode] = useState(
    existingTree !== null
      ? existingTree
      : {
          currentId: "node0",
          content: "",
          parentId: null,
          noChild: [],
          yesChild: [],
          xPos: 0,
          yPos: 0,
        }
  );

  // Image State
  const [coverImage, setCoverImage] = useState(
    existingCoverImage !== "" ? existingCoverImage : ""
  );

  // AboutLink state
  const [aboutLink, setAboutLink] = useState(
    existingAboutLink !== "" ? existingAboutLink : ""
  );

  useEffect(() => {
    /**
     * Recursively flattens the tree structure.
     * @param {Object} node - The current node being processed.
     * @returns {Object|null} - Returns the flattened node.
     */
    function flattenAllNodes(node) {
      if (!node) {
        return null;
      }

      const flattenedNode = {
        ...node,
        yesChild:
          node.yesChild && node.yesChild.length > 0
            ? flattenAllNodes(node.yesChild[0])
            : null,
        noChild:
          node.noChild && node.noChild.length > 0
            ? flattenAllNodes(node.noChild[0])
            : null,
      };

      return flattenedNode;
    }

    let treePayload = flattenAllNodes(rootNode);

    let payload = {
      name: title,
      nodeTree: treePayload,
      coverImage: coverImage,
      aboutLink: aboutLink,
      existingMidOffsets: existingMidOffsets,
      status: "published",
    };
    setTreePayload(payload);
  }, [
    title,
    rootNode,
    coverImage,
    aboutLink,
    existingMidOffsets,
    setTreePayload,
  ]);

  return (
    <>
      <div className="content-section">
        <div className="title-section">
          {/* EditTreeTitle component */}
          <EditTreeTitle title={title} setTitle={setTitle}></EditTreeTitle>
          {/* AboutLink component */}
          <AboutLink
            aboutLink={aboutLink}
            setAboutLink={setAboutLink}
          ></AboutLink>
          {/* ArticleCover component */}
          <ArticleCover
            coverImage={coverImage}
            setCoverImage={setCoverImage}
          ></ArticleCover>

          {/* NodeArea component - ARCHIVED FOR REFERENCE*/}
          {/* <NodeArea rootNode={rootNode} setRootNode={setRootNode}></NodeArea> */}

          {/* NodeFlow component - CURRENT VERSION*/}
          <NodeFlow
            rootNode={rootNode}
            setRootNode={setRootNode}
            existingMidOffsets={existingMidOffsets}
            setExistingMidOffsets={setExistingMidOffsets}
          ></NodeFlow>
        </div>
      </div>
    </>
  );
};

export default AdminCreateTree;
