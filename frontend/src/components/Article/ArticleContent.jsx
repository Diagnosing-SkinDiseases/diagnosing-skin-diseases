import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { parseData, generateSummary } from "./articleComponentController";

/**
 * ArticleContent component renders the content of an article, including the title, summary, and dynamic content.
 * @param {Object} data - The data object containing the title and content of the article.
 * @param {string} data.title - The title of the article.
 * @param {Array} data.content - An array containing objects representing different types of content in the article.
 * @returns {JSX.Element} - Returns the JSX element for the article content.
 */
const ArticleContent = ({ data: { title, content } }) => {
  // Get hash value from URL location
  const { hash } = useLocation();

  /**
   * Handles hash navigation within the article.
   * @param {string} hash - The current hash value from the URL, to identify the target section.
   */
  useEffect(() => {
    if (hash) {
      // Wait for the dynamic content to render
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [hash, content]);

  return (
    <>
      {/* Content */}
      <div className="container px-5">
        {/* Title */}
        <div className="container mt-4 article-title text-center">
          <h1>{title}</h1>
          <hr></hr>
        </div>

        {/* Summary */}
        <div className="container summary">
          {generateSummary(content)}
        </div>

        {/* Article */}
        <div className="container p-4 pt-0">
          {/* Dynamic Content*/}
          {content.map(parseData)}
        </div>
      </div>
    </>
  );
};

export default ArticleContent;
