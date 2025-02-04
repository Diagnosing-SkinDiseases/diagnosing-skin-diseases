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
  data,
}) => {
  // Shift the target end of the edge upwards for visuals
  const edgeType = data.sourceHandle;
  const adjustmentValue = 1.5;
  const adjustTargetX =
    targetX -
    (data.sourceHandle === "yes" ? adjustmentValue : -adjustmentValue) * 2;
  // const adjustTargetX = targetX;
  const adjustTargetY = targetY - adjustmentValue;

  console.log("SOURCE", edgeType);

  // Get the edge path and center position
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX: adjustTargetX,
    targetY: adjustTargetY,
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
