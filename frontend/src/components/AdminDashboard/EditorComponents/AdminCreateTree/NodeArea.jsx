import {
  faAngleDown,
  faAngleUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import "./styles/AdminCreateTrees.css";
import { useState } from "react";
import YesNodeArea from "./NodeAreas/YesNodeArea";
import NoNodeArea from "./NodeAreas/NoNodeArea";
import styles from "./styles/styles";
import RootNodeArea from "./NodeAreas/RootNodeArea";

const NodeArea = ({ rootNode, setRootNode }) => {
  // Node ID state
  const [idCounter, setIdCounter] = useState(0);
  return (
    <>
      <RootNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
      ></RootNodeArea>
      <YesNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
      ></YesNodeArea>
      <NoNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
        idCounter={idCounter}
        setIdCounter={setIdCounter}
      ></NoNodeArea>
    </>
  );
};

export default NodeArea;
