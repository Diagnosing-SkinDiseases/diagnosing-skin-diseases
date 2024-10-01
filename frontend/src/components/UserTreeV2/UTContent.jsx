import React, { useEffect, useState } from "react";
import UTNodeFlow from "./UTNodeFlow";
import "../CSS/UserTreeV2.css";

const UTContent = ({ existingTitle, existingTree }) => {
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

  return (
    <>
      <div className="ut-content-bg">
        {" "}
        <div className="ut-content-main-content">
          <h1 className="ut-content-title">{existingTitle}</h1>
          <UTNodeFlow
            rootNode={rootNode}
            setRootNode={setRootNode}
          ></UTNodeFlow>
        </div>
      </div>
    </>
  );
};

export default UTContent;
