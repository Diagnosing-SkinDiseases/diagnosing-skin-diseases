import { useReactFlow } from "@xyflow/react";

import UserDetailedEdge from "../../../../../UserTreeV2/FlowComponents/DetailedEdge";

/*
 * ============================================================
 * ADMIN EDITOR - DETAILED EDGE CONFIGURATION
 * ============================================================
 *
 * The Admin Editor uses visible connection handles
 * to allow manual creation of Yes/No relationships.
 *
 * Those handles are independent of the coordinates
 * used to render existing arrows.
 *
 * This component calculates the geometric center
 * of each connected node, then supplies those
 * coordinates to the shared UserTreeV2 renderer.
 *
 * The shared renderer continues to handle:
 *
 * - Arrowhead positioning at node boundaries
 * - Arrowhead dimensions
 * - Arrow shaft thickness
 * - Red/green directional colors
 * - Bend-point calculations
 * - Midpoint dragging
 * - Saved midpoint offsets
 *
 * ============================================================
 */

// Fallback dimensions when a node has not been measured.
const FALLBACK_NODE_WIDTH = 100;
const FALLBACK_NODE_HEIGHT = 100;

/*
 * ============================================================
 * NODE GEOMETRY HELPER
 * ============================================================
 *
 * Returns the actual geometric center of a node
 * in React Flow's coordinate system.
 *
 * React Flow stores node positions relative to
 * their top-left corner by default.
 *
 * Internal absolute positions are preferred
 * because they also account for parent nodes
 * and React Flow's node origin configuration.
 *
 * The fallback coordinates are the original
 * handle positions supplied by React Flow.
 */

const getNodeCenter = (
  nodeId,
  getNode,
  getInternalNode,
  fallbackX,
  fallbackY,
) => {
  if (!nodeId) {
    return {
      x: fallbackX,
      y: fallbackY,
    };
  }

  const node = getNode(nodeId);
  const internalNode = getInternalNode(nodeId);

  /*
   * Prefer measured node dimensions.
   */
  const measuredWidth = Number(
    internalNode?.measured?.width ?? node?.measured?.width ?? node?.width,
  );

  const measuredHeight = Number(
    internalNode?.measured?.height ?? node?.measured?.height ?? node?.height,
  );

  const width =
    Number.isFinite(measuredWidth) && measuredWidth > 0
      ? measuredWidth
      : FALLBACK_NODE_WIDTH;

  const height =
    Number.isFinite(measuredHeight) && measuredHeight > 0
      ? measuredHeight
      : FALLBACK_NODE_HEIGHT;

  /*
   * Resolve the node's absolute top-left position.
   */
  const absolutePosition = internalNode?.internals?.positionAbsolute;

  const nodePosition = absolutePosition ?? node?.position;

  const positionX = Number(nodePosition?.x);
  const positionY = Number(nodePosition?.y);

  /*
   * If position information is unavailable,
   * preserve React Flow's supplied coordinates.
   */
  if (!Number.isFinite(positionX) || !Number.isFinite(positionY)) {
    return {
      x: fallbackX,
      y: fallbackY,
    };
  }

  /*
   * Convert from top-left position to
   * geometric center.
   */
  return {
    x: positionX + width / 2,
    y: positionY + height / 2,
  };
};

/*
 * ============================================================
 * ADMIN DETAILED EDGE COMPONENT
 * ============================================================
 */

const DetailedEdge = (props) => {
  const { getNode, getInternalNode } = useReactFlow();

  const { source, target, sourceX, sourceY, targetX, targetY } = props;

  /*
   * SOURCE NODE CENTER
   *
   * Ignore the source handle's visual position
   * when calculating the existing arrow's origin.
   */
  const sourceCenter = getNodeCenter(
    source,
    getNode,
    getInternalNode,
    sourceX,
    sourceY,
  );

  /*
   * TARGET NODE CENTER
   *
   * Ignore the target handle's visual position
   * when calculating the existing arrow's
   * destination.
   */
  const targetCenter = getNodeCenter(
    target,
    getNode,
    getInternalNode,
    targetX,
    targetY,
  );

  /*
   * ============================================================
   * SHARED ARROW RENDERER
   * ============================================================
   *
   * Preserve every original edge property,
   * including:
   *
   * - id
   * - source and target IDs
   * - sourceHandle and targetHandle
   * - data
   * - style
   * - selection state
   * - midpoint offsets
   *
   * Override only the geometric coordinates
   * used to construct the visible arrow.
   *
   * React Flow's editing handles remain
   * unchanged and fully independent.
   */

  return (
    <UserDetailedEdge
      {...props}
      sourceX={sourceCenter.x}
      sourceY={sourceCenter.y}
      targetX={targetCenter.x}
      targetY={targetCenter.y}
    />
  );
};

export default DetailedEdge;
