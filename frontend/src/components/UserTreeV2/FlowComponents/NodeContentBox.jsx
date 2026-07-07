import React from "react";
import InternalLink from "../../Reusable/InternalLink";

const NodeContentBox = ({ content, onBack, onNo, onYes, selectedNode }) => {
  const toRelativeIfAbsolute = (url = "") => {
    if (!/^https?:\/\//i.test(url)) {
      return url;
    }

    try {
      const parsedUrl = new URL(url);

      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
      return url;
    }
  };
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
        segments.push(
          <div
            className="ut-tree-diagnosis-button-container"
            key={`container-${url}`}
          >
            <InternalLink
              className="ut-tree-diagnosis-button"
              key={`link-${url}`}
              to={toRelativeIfAbsolute(url)}
            >
              {linkText}
            </InternalLink>
          </div>,
        );
      } else {
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
