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
          <a key={url} href={url} target="_blank" rel="noopener noreferrer">
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
    <div className="ut-tree-content-box">
      <div className="ut-tree-content-buttons">
        {/* {selectedNode?.parentId && ( */}
        <button
          className={
            selectedNode?.parentId
              ? "ut-tree-content-button ut-tree-content-back"
              : "ut-tree-content-button ut-tree-content-back ut-hidden"
          }
          onClick={onBack}
        >
          Back
        </button>

        {/* {selectedNode?.noChild.length > 0 && ( */}
        <button
          className={
            selectedNode?.noChild.length > 0
              ? "ut-tree-content-button ut-tree-content-no"
              : "ut-tree-content-button ut-tree-content-no ut-hidden"
          }
          onClick={onNo}
        >
          No
        </button>

        {/* {selectedNode?.yesChild.length > 0 && ( */}
        <button
          className={
            selectedNode?.yesChild.length > 0
              ? "ut-tree-content-button ut-tree-content-yes"
              : "ut-tree-content-button ut-tree-content-yes ut-hidden"
          }
          onClick={onYes}
        >
          Yes
        </button>
      </div>
      <div className="ut-tree-content-text">
        {content ? parseContent(content) : "Select a node to see its content."}
      </div>
    </div>
  );
};

export default NodeContentBox;
