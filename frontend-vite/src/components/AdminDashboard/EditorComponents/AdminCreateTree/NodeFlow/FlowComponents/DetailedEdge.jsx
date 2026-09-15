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
  // Adjust target and source positioning if necessary
  targetY = targetY + 2;
  sourceY = sourceY - 2;

  // Get the edge path and center position
  const [edgePath] = getStraightPath({
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
