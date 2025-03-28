import React, { useState, useRef, useEffect } from "react";
import { getStraightPath, useReactFlow } from "@xyflow/react";

const DetailedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  data,
}) => {
  const arrowId = `arrow-${id}`;
  const { getViewport } = useReactFlow();
  const svgRef = useRef(null);

  // Adjust source
  const sourceAdjustmentValue = 1;
  const adjustedSourceX =
    sourceX -
    (data?.sourceHandle === "yes"
      ? sourceAdjustmentValue
      : -sourceAdjustmentValue);
  const adjustedSourceY = sourceY - sourceAdjustmentValue * 6;

  // Adjust target
  const alignment = sourceX - targetX < 0 ? "right" : "left";
  const targetAdjustmentValue = 2;
  const adjustedTargetX =
    targetX -
    (alignment === "right" ? targetAdjustmentValue : -targetAdjustmentValue) *
      8;
  const adjustedTargetY = targetY - targetAdjustmentValue * 1;

  // Midpoint
  const initialMidX = (adjustedSourceX + adjustedTargetX) / 2;
  const initialMidY = (adjustedSourceY + adjustedTargetY) / 2;

  const [midOffset, setMidOffset] = useState(
    () => data?.midOffset || { x: 0, y: 0 }
  );
  const bendX = initialMidX + midOffset.x;
  const bendY = initialMidY + midOffset.y;

  const edgePath = `M ${adjustedSourceX},${adjustedSourceY} L ${bendX},${bendY} L ${adjustedTargetX},${adjustedTargetY}`;

  // Logging
  useEffect(() => {});

  // Drag logic
  const isDragging = useRef(false);
  const midOffsetStart = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });

  const convertClientToSvg = (clientX, clientY) => {
    const svg = svgRef.current?.ownerSVGElement;
    if (!svg) return { x: clientX, y: clientY };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const transformed = pt.matrixTransform(ctm.inverse());
      return { x: transformed.x, y: transformed.y };
    }
    return { x: clientX, y: clientY };
  };

  const onMouseDown = (event) => {
    isDragging.current = true;
    midOffsetStart.current = { ...midOffset };

    const svgCoords = convertClientToSvg(event.clientX, event.clientY);
    dragStart.current = svgCoords;

    event.stopPropagation();
    event.preventDefault();
  };

  const onMouseMove = (event) => {
    if (!isDragging.current) return;

    const svgCoords = convertClientToSvg(event.clientX, event.clientY);
    const deltaX = svgCoords.x - dragStart.current.x;
    const deltaY = svgCoords.y - dragStart.current.y;

    setMidOffset({
      x: midOffsetStart.current.x + deltaX,
      y: midOffsetStart.current.y + deltaY,
    });
  };

  // Update mid offset payload on change
  useEffect(() => {
    if (!data?.setExistingMidOffsets) return;

    data.setExistingMidOffsets((items) =>
      items.map((item) => (item.edgeId === id ? { ...item, midOffset } : item))
    );
  }, [midOffset]);

  const onMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <>
      <defs>
        <marker
          id={arrowId}
          markerWidth="10"
          markerHeight="16"
          refX="8"
          refY="8"
          orient="auto"
        >
          <polygon
            points="3 6, 10 8, 3 10"
            fill={data?.sourceHandle === "yes" ? "green" : "red"}
          />
        </marker>
      </defs>
      <path
        ref={svgRef}
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${arrowId})`}
        fill="none"
        stroke="black"
      />
      {data.admin && (
        <circle
          cx={bendX}
          cy={bendY}
          r={6}
          fill="black"
          stroke="white"
          strokeWidth={1.5}
          onMouseDown={onMouseDown}
          style={{
            cursor: "grab",
            pointerEvents: "all",
          }}
        />
      )}
    </>
  );
};

export default DetailedEdge;
