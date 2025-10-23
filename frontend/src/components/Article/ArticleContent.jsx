import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  parseData,
  generateSummary,
  renderError,
} from "./articleComponentController";
import ArticleContentType from "./enums";

/**
 * ArticleContent component renders the content of an article, including the title, summary, and dynamic content.
 * @param {Object} data - The data object containing the title and content of the article.
 * @param {string} data.title - The title of the article.
 * @param {Array} data.content - An array containing objects representing different types of content in the article.
 * @returns {JSX.Element} - Returns the JSX element for the article content.
 */
const ArticleContent = ({ data: { title, content }, errorMsg }) => {
  // Get hash value from URL location
  const { hash } = useLocation();
  const firstH1Index = content.findIndex(
    (item) => item.type === ArticleContentType.HEADER1
  );

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

  // To calculate summary container heigh and scroll margin top
  useEffect(() => {
    const headerOffsetEl = document.querySelector(".summary-container");
    if (headerOffsetEl) {
      const height = headerOffsetEl.offsetHeight + 120;
      document.documentElement.style.setProperty(
        "--dynamic-scroll-margin",
        `${height}px`
      );
    }
  }, [content]);

  return (
    <>
      {errorMsg ? (
        // Display error message if available
        <div className="container px-5">
          <div className="container mt-4 article-title text-center">
            <h1>Not Found</h1>
            <hr />
          </div>
          <div className="container summary text-center">
            <p className="error-info-message">{errorMsg}</p>
          </div>
        </div>
      ) : (
        // Display article content if no error message
        <div className="container px-5">
          {/* Title */}
          <div className="container mt-4 article-title text-center">
            <h1>{title}</h1>
          </div>

          {/* Summary */}
          <div className="container summary-container">
            {generateSummary(content)}
          </div>

          {/* Article */}
          <div className="container p-4 pt-0">
            {/* Dynamic Content */}
            {content.map((item, index) => parseData(item, index, firstH1Index))}
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleContent;
