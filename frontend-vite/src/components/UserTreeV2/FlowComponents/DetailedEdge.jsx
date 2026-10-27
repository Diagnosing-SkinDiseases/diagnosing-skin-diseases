import React, { useState, useRef, useEffect } from "react";
import { useReactFlow, EdgeLabelRenderer } from "@xyflow/react";

/*
 * ============================================================
 * ARROW VISUAL CONFIGURATION
 * ============================================================
 *
 * Modify these values to customize arrow appearance.
 * All dimensions use React Flow coordinate units.
 */

// Toggle geometry diagnostic markers.
const DEBUG_ARROW_GEOMETRY = false;

// Length of the triangular arrowhead.
const ARROWHEAD_LENGTH = 32;

// Half the total width of the arrowhead.
// Example: 14 means a total width of 28.
const ARROWHEAD_HALF_WIDTH = 16;

// Distance between arrowhead tip and node boundary.
// Zero means the tip touches the calculated boundary.
const ARROWHEAD_BOUNDARY_PADDING = 0;

// Small overlap between shaft and arrowhead base.
// Prevents small antialiasing gaps.
const ARROWHEAD_SHAFT_OVERLAP = 1;

// Thickness of the arrow shaft.
const ARROWHEAD_SHAFT_WIDTH = 8;

// Fallback size if React Flow has not measured a node.
const ARROWHEAD_FALLBACK_NODE_SIZE = 100;

/*
 * ============================================================
 * GEOMETRY CONFIGURATION
 * ============================================================
 */

// Prevent division by extremely small values.
const GEOMETRY_EPSILON = 0.000001;

// Use actual node rectangles for boundary intersections.
const USE_ACCURATE_NODE_BOUNDARY = true;

// Keep disabled for the current working geometry.
// Enabling this may move arrowheads away from nodes.
const ENABLE_FULL_ARROWHEAD_CLEARANCE = false;

/*
 * ============================================================
 * DEBUG CONFIGURATION
 * ============================================================
 */

const DEBUG_MARKER_RADIUS = 7;

const DEBUG_COLORS = {
  handle: "#FF00FF",
  center: "#00D9FF",
  boundary: "#FFDD00",
  correctedTip: "#FFFFFF",
};

const DebugMarker = ({ x, y, color, label }) => {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: DEBUG_MARKER_RADIUS * 2,
          height: DEBUG_MARKER_RADIUS * 2,
          borderRadius: "50%",
          backgroundColor: color,
          border: "2px solid black",
          boxSizing: "border-box",
          boxShadow: "0 0 0 2px white",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: -23,
          left: 12,
          whiteSpace: "nowrap",
          color: "black",
          backgroundColor: "white",
          border: `1px solid ${color}`,
          borderRadius: 3,
          padding: "2px 5px",
          fontSize: 11,
          fontWeight: "bold",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/*
 * ============================================================
 * RECTANGLE BOUNDARY INTERSECTION
 * ============================================================
 *
 * Finds where a ray travelling backwards from
 * the target handle intersects the node rectangle.
 *
 * Also identifies the intersected face.
 */

const getRectangleBoundaryIntersection = (
  originX,
  originY,
  directionX,
  directionY,
  rect,
) => {
  const candidates = [];

  const { left, right, top, bottom } = rect;

  // Intersections with vertical faces.
  if (Math.abs(directionX) > GEOMETRY_EPSILON) {
    const verticalFaces = [
      { coordinate: left, face: "left" },
      { coordinate: right, face: "right" },
    ];

    for (const boundary of verticalFaces) {
      const distance = (originX - boundary.coordinate) / directionX;

      const intersectionY = originY - directionY * distance;

      if (
        distance >= 0 &&
        intersectionY >= top - GEOMETRY_EPSILON &&
        intersectionY <= bottom + GEOMETRY_EPSILON
      ) {
        candidates.push({
          x: boundary.coordinate,
          y: intersectionY,
          distance,
          face: boundary.face,
        });
      }
    }
  }

  // Intersections with horizontal faces.
  if (Math.abs(directionY) > GEOMETRY_EPSILON) {
    const horizontalFaces = [
      { coordinate: top, face: "top" },
      { coordinate: bottom, face: "bottom" },
    ];

    for (const boundary of horizontalFaces) {
      const distance = (originY - boundary.coordinate) / directionY;

      const intersectionX = originX - directionX * distance;

      if (
        distance >= 0 &&
        intersectionX >= left - GEOMETRY_EPSILON &&
        intersectionX <= right + GEOMETRY_EPSILON
      ) {
        candidates.push({
          x: intersectionX,
          y: boundary.coordinate,
          distance,
          face: boundary.face,
        });
      }
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => a.distance - b.distance);

  return candidates[0];
};

/*
 * ============================================================
 * FACE NORMALS
 * ============================================================
 *
 * A normal points directly outward from a node face.
 */

const getFaceNormal = (face) => {
  switch (face) {
    case "left":
      return { x: -1, y: 0 };

    case "right":
      return { x: 1, y: 0 };

    case "top":
      return { x: 0, y: -1 };

    case "bottom":
      return { x: 0, y: 1 };

    default:
      return null;
  }
};

/*
 * ============================================================
 * FULL ARROWHEAD CLEARANCE
 * ============================================================
 *
 * Optional correction for positioning the entire
 * triangle outside the target node.
 *
 * Currently disabled because the working version
 * uses direct boundary alignment.
 */

const getArrowheadClearanceDistance = (
  vertices,
  intersection,
  face,
  ux,
  uy,
  minimumClearance,
) => {
  const normal = getFaceNormal(face);

  if (!normal || vertices.length === 0) {
    return 0;
  }

  const clearances = vertices.map((vertex) => {
    const dx = vertex.x - intersection.x;
    const dy = vertex.y - intersection.y;

    return dx * normal.x + dy * normal.y;
  });

  const minimumVertexClearance = Math.min(...clearances);

  if (minimumVertexClearance >= minimumClearance) {
    return 0;
  }

  const requiredClearance = minimumClearance - minimumVertexClearance;

  const outwardMovementPerUnit = -(ux * normal.x + uy * normal.y);

  if (outwardMovementPerUnit <= GEOMETRY_EPSILON) {
    return 0;
  }

  return requiredClearance / outwardMovementPerUnit;
};

/*
 * ============================================================
 * DETAILED EDGE COMPONENT
 * ============================================================
 */

const DetailedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  target,
  style = {},
  data,
}) => {
  const { getNode, getInternalNode } = useReactFlow();

  const svgRef = useRef(null);

  /*
   * LOGICAL CENTER-TO-CENTER GEOMETRY
   */

  const initialMidX = (sourceX + targetX) / 2;
  const initialMidY = (sourceY + targetY) / 2;

  const [midOffset, setMidOffset] = useState(
    () => data?.midOffset || { x: 0, y: 0 },
  );

  const bendX = initialMidX + midOffset.x;
  const bendY = initialMidY + midOffset.y;

  const edgeColor = data?.sourceHandle === "yes" ? "green" : "red";

  /*
   * TARGET NODE DIMENSIONS
   */

  const targetNode = getNode(target);
  const internalTargetNode = getInternalNode(target);

  const measuredWidth = Number(
    internalTargetNode?.measured?.width ??
      targetNode?.measured?.width ??
      targetNode?.width,
  );

  const measuredHeight = Number(
    internalTargetNode?.measured?.height ??
      targetNode?.measured?.height ??
      targetNode?.height,
  );

  const targetWidth =
    Number.isFinite(measuredWidth) && measuredWidth > 0
      ? measuredWidth
      : ARROWHEAD_FALLBACK_NODE_SIZE;

  const targetHeight =
    Number.isFinite(measuredHeight) && measuredHeight > 0
      ? measuredHeight
      : ARROWHEAD_FALLBACK_NODE_SIZE;

  /*
   * TARGET NODE RECTANGLE
   */

  const absolutePosition = internalTargetNode?.internals?.positionAbsolute;

  const hasAbsolutePosition =
    Number.isFinite(absolutePosition?.x) &&
    Number.isFinite(absolutePosition?.y);

  const nodeLeft = hasAbsolutePosition
    ? absolutePosition.x
    : targetX - targetWidth / 2;

  const nodeTop = hasAbsolutePosition
    ? absolutePosition.y
    : targetY - targetHeight / 2;

  const nodeRect = {
    left: nodeLeft,
    right: nodeLeft + targetWidth,
    top: nodeTop,
    bottom: nodeTop + targetHeight,
  };

  const actualNodeCenterX = nodeLeft + targetWidth / 2;

  const actualNodeCenterY = nodeTop + targetHeight / 2;

  /*
   * INCOMING DIRECTION
   *
   * Use the final segment of the connection
   * to determine the arrowhead's rotation.
   */

  let directionX = targetX - bendX;
  let directionY = targetY - bendY;

  let directionLength = Math.hypot(directionX, directionY);

  if (directionLength < GEOMETRY_EPSILON) {
    directionX = targetX - sourceX;
    directionY = targetY - sourceY;

    directionLength = Math.hypot(directionX, directionY);
  }

  /*
   * VISIBLE ARROW GEOMETRY
   */

  let visibleEndX = targetX;
  let visibleEndY = targetY;

  let arrowheadPath = null;

  let boundaryIntersectionX = null;
  let boundaryIntersectionY = null;

  let correctedTipX = null;
  let correctedTipY = null;

  let intersectedFace = null;

  if (directionLength > GEOMETRY_EPSILON) {
    const ux = directionX / directionLength;
    const uy = directionY / directionLength;

    /*
     * FIND TARGET BOUNDARY INTERSECTION
     */

    let intersection = null;

    if (USE_ACCURATE_NODE_BOUNDARY) {
      intersection = getRectangleBoundaryIntersection(
        targetX,
        targetY,
        ux,
        uy,
        nodeRect,
      );
    }

    /*
     * CENTER-BASED FALLBACK
     */

    if (!intersection) {
      const halfWidth = targetWidth / 2;
      const halfHeight = targetHeight / 2;

      const distanceX =
        Math.abs(ux) > GEOMETRY_EPSILON ? halfWidth / Math.abs(ux) : Infinity;

      const distanceY =
        Math.abs(uy) > GEOMETRY_EPSILON ? halfHeight / Math.abs(uy) : Infinity;

      const boundaryDistance = Math.min(distanceX, distanceY);

      const face =
        distanceX <= distanceY
          ? ux > 0
            ? "left"
            : "right"
          : uy > 0
            ? "top"
            : "bottom";

      intersection = {
        x: targetX - ux * boundaryDistance,
        y: targetY - uy * boundaryDistance,
        face,
      };
    }

    boundaryIntersectionX = intersection.x;
    boundaryIntersectionY = intersection.y;
    intersectedFace = intersection.face;

    /*
     * INITIAL ARROWHEAD
     *
     * With zero boundary padding, the arrowhead
     * tip is placed directly at the intersection.
     */

    let tipX = intersection.x - ux * ARROWHEAD_BOUNDARY_PADDING;

    let tipY = intersection.y - uy * ARROWHEAD_BOUNDARY_PADDING;

    /*
     * ARROWHEAD BASE
     */

    let baseX = tipX - ux * ARROWHEAD_LENGTH;

    let baseY = tipY - uy * ARROWHEAD_LENGTH;

    /*
     * ARROWHEAD CORNERS
     */

    let leftX = baseX - uy * ARROWHEAD_HALF_WIDTH;

    let leftY = baseY + ux * ARROWHEAD_HALF_WIDTH;

    let rightX = baseX + uy * ARROWHEAD_HALF_WIDTH;

    let rightY = baseY - ux * ARROWHEAD_HALF_WIDTH;

    /*
     * OPTIONAL FULL TRIANGLE CLEARANCE
     *
     * Disabled by default.
     *
     * When enabled, this shifts the complete
     * triangle away from the node if necessary.
     */

    if (ENABLE_FULL_ARROWHEAD_CLEARANCE) {
      const vertices = [
        { x: tipX, y: tipY },
        { x: leftX, y: leftY },
        { x: rightX, y: rightY },
      ];

      const correctionDistance = getArrowheadClearanceDistance(
        vertices,
        intersection,
        intersectedFace,
        ux,
        uy,
        ARROWHEAD_BOUNDARY_PADDING,
      );

      const correctionX = -ux * correctionDistance;
      const correctionY = -uy * correctionDistance;

      tipX += correctionX;
      tipY += correctionY;

      baseX += correctionX;
      baseY += correctionY;

      leftX += correctionX;
      leftY += correctionY;

      rightX += correctionX;
      rightY += correctionY;
    }

    /*
     * VISIBLE SHAFT TERMINATION
     *
     * End the shaft at the arrowhead base
     * rather than continuing through the triangle.
     */

    visibleEndX = baseX + ux * ARROWHEAD_SHAFT_OVERLAP;

    visibleEndY = baseY + uy * ARROWHEAD_SHAFT_OVERLAP;

    /*
     * DIAGNOSTIC TIP COORDINATES
     */

    correctedTipX = tipX;
    correctedTipY = tipY;

    /*
     * FINAL TRIANGULAR ARROWHEAD
     */

    arrowheadPath = `
      M ${tipX},${tipY}
      L ${leftX},${leftY}
      L ${rightX},${rightY}
      Z
    `;
  }

  /*
   * VISIBLE ARROW SHAFT
   *
   * Logical geometry remains center-to-center.
   * The rendered line ends at the triangle base.
   */

  const edgePath = `
    M ${sourceX},${sourceY}
    L ${bendX},${bendY}
    L ${visibleEndX},${visibleEndY}
  `;

  /*
   * ============================================================
   * MIDPOINT DRAGGING
   * ============================================================
   */

  const isDragging = useRef(false);

  const midOffsetStart = useRef({
    x: 0,
    y: 0,
  });

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  const convertClientToSvg = (clientX, clientY) => {
    const svg = svgRef.current?.ownerSVGElement;

    if (!svg) {
      return {
        x: clientX,
        y: clientY,
      };
    }

    const pt = svg.createSVGPoint();

    pt.x = clientX;
    pt.y = clientY;

    const ctm = svg.getScreenCTM();

    if (ctm) {
      const transformed = pt.matrixTransform(ctm.inverse());

      return {
        x: transformed.x,
        y: transformed.y,
      };
    }

    return {
      x: clientX,
      y: clientY,
    };
  };

  const onMouseDown = (event) => {
    isDragging.current = true;

    midOffsetStart.current = {
      ...midOffset,
    };

    dragStart.current = convertClientToSvg(event.clientX, event.clientY);

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

  const onMouseUp = () => {
    isDragging.current = false;
  };

  /*
   * SAVE EXISTING MIDPOINT OFFSETS
   */

  useEffect(() => {
    if (!data?.setExistingMidOffsets) return;

    data.setExistingMidOffsets((items) =>
      items.map((item) =>
        item.edgeId === id
          ? {
              ...item,
              midOffset,
            }
          : item,
      ),
    );
  }, [midOffset, id, data?.setExistingMidOffsets]);

  /*
   * DRAGGING EVENT LISTENERS
   */

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);

    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);

      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* Visible arrow shaft */}
      <path
        ref={svgRef}
        id={id}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: ARROWHEAD_SHAFT_WIDTH,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
      />

      {/*
       * Arrowhead.
       *
       * IMPORTANT:
       * Explicit inline styling prevents the
       * existing CSS edge selectors from adding
       * an unwanted stroke around the triangle.
       */}
      {arrowheadPath && (
        <path
          d={arrowheadPath}
          style={{
            fill: edgeColor,
            stroke: "none",
            strokeWidth: 0,
          }}
          pointerEvents="none"
        />
      )}

      {/* Existing draggable midpoint control */}
      {data?.admin && (
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

      {/* Optional geometry diagnostics */}
      {DEBUG_ARROW_GEOMETRY && (
        <EdgeLabelRenderer>
          <DebugMarker
            x={targetX}
            y={targetY}
            color={DEBUG_COLORS.handle}
            label="TARGET HANDLE"
          />

          <DebugMarker
            x={actualNodeCenterX}
            y={actualNodeCenterY}
            color={DEBUG_COLORS.center}
            label="NODE CENTER"
          />

          <DebugMarker
            x={boundaryIntersectionX}
            y={boundaryIntersectionY}
            color={DEBUG_COLORS.boundary}
            label={`BOUNDARY (${intersectedFace ?? "unknown"})`}
          />

          <DebugMarker
            x={correctedTipX}
            y={correctedTipY}
            color={DEBUG_COLORS.correctedTip}
            label="CORRECTED TIP"
          />
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default DetailedEdge;
