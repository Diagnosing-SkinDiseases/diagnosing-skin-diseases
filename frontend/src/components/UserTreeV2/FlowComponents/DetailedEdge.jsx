import { getStraightPath } from "@xyflow/react";

const DetailedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
}) => {
  // Custom arrowhead ID based on type
  const arrowId = `arrow-${id}`;

  // Define a sharper arrowhead
  const markerSvg = (
    <svg id="ut-test">
      <defs>
        <marker
          id={arrowId}
          markerWidth="10" // Keep a reasonable width
          markerHeight="16" // Increase height to make it sharper
          refX="8" // Keep tip aligned
          refY="8" // Center vertically
          orient="auto"
        >
          <polygon
            points="3 6, 10 8, 3 10" // Increase height for a sharper look
            fill={data?.sourceHandle === "yes" ? "green" : "red"}
          />
        </marker>
      </defs>
    </svg>
  );

  // Adjust source position
  const sourceAdjustmentValue = 1;
  const adjustedSourceX =
    sourceX -
    (data?.sourceHandle === "yes"
      ? sourceAdjustmentValue
      : -sourceAdjustmentValue) *
      1;
  const adjustedSourceY = sourceY - sourceAdjustmentValue * 6;

  // Adjust the target position for arrow head alignment

  const alignment = sourceX - targetX < 0 ? "right" : "left";

  const targetAdjustmentValue = 2;
  const adjustTargetX =
    targetX -
    (alignment === "right" ? targetAdjustmentValue : -targetAdjustmentValue) *
      8;
  const adjustTargetY = targetY - targetAdjustmentValue * 1;

  // Get the edge path
  const [edgePath] = getStraightPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    targetX: adjustTargetX,
    targetY: adjustTargetY,
  });

  return (
    <>
      {markerSvg} {/* Include the custom arrowhead definition */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${arrowId})`} // Apply the custom marker
      />
    </>
  );
};

export default DetailedEdge;
