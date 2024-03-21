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
  useEffect(() => {
    console.log("Check area", setRootNode);
  }, []);
  return (
    <>
      <RootNodeArea
        rootNode={rootNode}
        setRootNode={setRootNode}
      ></RootNodeArea>
      <YesNodeArea rootNode={rootNode} setRootNode={setRootNode}></YesNodeArea>
      <NoNodeArea rootNode={rootNode} setRootNode={setRootNode}></NoNodeArea>
    </>
  );
};

export default NodeArea;
