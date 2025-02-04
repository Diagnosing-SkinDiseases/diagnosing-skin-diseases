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
  style = {},
  markerEnd,
}) => {
  // Calculate the length of the edge
  const length = Math.sqrt(
    Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2)
  ).toFixed(2);

  // Calculate the angle of the edge
  const angle = (
    (Math.atan2(targetY - sourceY, targetX - sourceX) * 180) /
    Math.PI
  ).toFixed(2);

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

  // Try to give access to height instead of length and angles
  // 6 nodes, 6 nodes, set angle and legth to same values
  // 10 nodes on one level, wider tree, to fit all 10 nodes must have different angles
  // first set height, then calculate angle based on that row

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text
        x={edgeCenterX}
        y={edgeCenterY}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 12, fill: "#222" }}
      ></text>
    </>
  );
};

export default DetailedEdge;
