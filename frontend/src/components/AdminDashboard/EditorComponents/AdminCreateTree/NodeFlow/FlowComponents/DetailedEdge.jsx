// DetailedEdge.js
import React from "react";
import { getBezierPath, getEdgeCenter } from "react-flow-renderer";
import { BaseEdge, getStraightPath } from "@xyflow/react";

const DetailedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style = {},
}) => {
  // Archive Calculate the length of the edge
  // const length = Math.sqrt(
  //   Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
  // ).toFixed(2);

  // Archive Calculate the angle of the edge
  // const angle = (
  //   (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) /
  //   Math.PI
  // ).toFixed(2);

  // Get the edge path and center position
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* Path with markerEnd */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default DetailedEdge;
