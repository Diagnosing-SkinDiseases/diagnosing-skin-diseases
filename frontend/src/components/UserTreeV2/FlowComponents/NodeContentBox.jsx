import React from "react";

const NodeContentBox = ({ content, onBack, onNo, onYes, selectedNode }) => {
  const parseContent = (text) => {
    // Regular expression to detect <a> tags and <br> tags
    const linkAndBreakRegex = /<a href="([^"]+)"[^>]*>(.*?)<\/a>|<br\s*\/?>/g;
    const segments = [];
    let lastIndex = 0;

    let match;
    while ((match = linkAndBreakRegex.exec(text)) !== null) {
      const [fullMatch, url, linkText] = match;
      const matchStart = match.index;

      // Add regular text before the match
      if (lastIndex < matchStart) {
        segments.push(text.slice(lastIndex, matchStart));
      }

      if (url && linkText) {
        // Add the link as a React element
        segments.push(
          <a key={url} href={url} target="_self" rel="noopener noreferrer">
            {linkText}
          </a>
        );
      } else {
        // Add a line break for <br> tags
        segments.push(<br key={`br-${segments.length}`} />);
      }

      // Update the last index to end of the current match
      lastIndex = match.index + fullMatch.length;
    }

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      segments.push(text.slice(lastIndex));
    }

    return segments;
  };

  return (
    <div style={boxStyle}>
      <div className="ut-tree-content-buttons">
        {selectedNode?.parentId && (
          <button
            className="ut-tree-content-button ut-tree-content-back"
            onClick={onBack}
          >
            Back
          </button>
        )}

        {selectedNode?.noChild.length > 0 && (
          <button
            className="ut-tree-content-button ut-tree-content-no"
            onClick={onNo}
          >
            No
          </button>
        )}

        {selectedNode?.yesChild.length > 0 && (
          <button
            className="ut-tree-content-button ut-tree-content-yes"
            onClick={onYes}
          >
            Yes
          </button>
        )}
      </div>
      <div className="ut-tree-content-text">
        {content ? parseContent(content) : "Select a node to see its content."}
      </div>
    </div>
  );
};

const boxStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  zIndex: 10,
  width: "200px",
  textAlign: "center",
};

const headingStyle = {
  margin: "0 0 10px",
  fontSize: "16px",
  fontWeight: "bold",
};

const contentStyle = {
  fontSize: "14px",
  color: "#555",
  marginBottom: "10px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const buttonStyle = {
  padding: "5px 10px",
  fontSize: "12px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
  backgroundColor: "#f0f0f0",
  transition: "background-color 0.3s ease",
};

export default NodeContentBox;
