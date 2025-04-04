import React from "react";

const NodeLegend = () => {
  return (
    <div className={"ut-tree-legend-box"}>
      <h4 className="ut-tree-legend-title">Legend</h4>
      <div className="ut-tree-legend-item">
        <div className="ut-tree-legend-node ut-tree-legend-selected" />
        <div className="ut-tree-legend-label"> You Are Here</div>
      </div>
      <div className="ut-tree-legend-item">
        <div className="ut-tree-legend-node ut-tree-legend-question" />
        <div className="ut-tree-legend-label"> Question Node</div>
      </div>
      <div className="ut-tree-legend-item">
        <div className="ut-tree-legend-node ut-tree-legend-result" />
        <div className="ut-tree-legend-label"> Result Node</div>
      </div>
    </div>
  );
};

const legendStyle = {
  position: "absolute",
  top: "10px",
  left: "10px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: 10,
  width: "150px",
};

export default NodeLegend;
