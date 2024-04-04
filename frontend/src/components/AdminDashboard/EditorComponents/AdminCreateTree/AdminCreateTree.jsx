import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./styles/AdminCreateTrees.css";
import { useState, useEffect } from "react";
import EditTreeTitle from "./EditTreeTitle";
import NodeArea from "./NodeArea";
import ArticleCover from "./ArticleCover";
import AboutLink from "./AboutLink";

// Component to create a new tree
const AdminCreateTree = ({
  existingTree,
  existingTitle,
  existingCoverImage,
  existingAboutLink,
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
    if (existingTree) {
      console.log("Edit mode");
    } else {
      console.log("Add mode");
    }
    console.log("existing", existingTree);
    console.log(title);
    console.log("root", rootNode);

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
      status: "published",
    };
    console.log("payload", payload);
    setTreePayload(payload);
    console.log("payload set");
  }, [title, rootNode, coverImage, aboutLink]);

  return (
    <>
      <div className="content-section">
        <div className="title-section">
          <EditTreeTitle title={title} setTitle={setTitle}></EditTreeTitle>
          <AboutLink
            aboutLink={aboutLink}
            setAboutLink={setAboutLink}
          ></AboutLink>
          <ArticleCover
            coverImage={coverImage}
            setCoverImage={setCoverImage}
          ></ArticleCover>
          <NodeArea rootNode={rootNode} setRootNode={setRootNode}></NodeArea>
        </div>
      </div>
    </>
  );
};

export default AdminCreateTree;
