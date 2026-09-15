import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parseData, generateSummary } from "./articleComponentController";
import ArticleContentType from "./enums";

/**
 * ArticleContent component renders the content of an article, including the
 * title, summary, and dynamic content.
 *
 * @param {Object} data - The article data.
 * @param {string} data.title - The article title.
 * @param {Array} data.content - The article content blocks.
 * @param {Array} overviewArticles - Overview article navigation data.
 * @param {string} errorMsg - Error message to display.
 * @returns {JSX.Element}
 */
const ArticleContent = ({
  data: { title, content },
  overviewArticles,
  errorMsg,
}) => {
  const { hash } = useLocation();

  const firstH1Index = content.findIndex(
    (item) => item.type === ArticleContentType.HEADER1,
  );

  const [selectedImage, setSelectedImage] = useState(null);

  /**
   * Handles hash navigation within the article.
   */
  useEffect(() => {
    if (!hash) return;

    const timeoutId = setTimeout(() => {
      const id = decodeURIComponent(hash.replace("#", ""));
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [hash, content]);

  // Calculate summary container height and update the scroll margin.
  useEffect(() => {
    const headerOffsetElement = document.querySelector(".summary-container");

    if (headerOffsetElement) {
      const height = headerOffsetElement.offsetHeight + 120;

      document.documentElement.style.setProperty(
        "--dynamic-scroll-margin",
        `${height}px`,
      );
    }
  }, [content]);

  const toRelativeUrl = (url = "") => {
    try {
      const parsedUrl = new URL(url);

      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
      return url;
    }
  };

  return (
    <>
      {errorMsg ? (
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
        <div className="container px-5">
          {/* Title */}
          <div className="container mt-4 article-title text-center">
            <h1>{title}</h1>
          </div>

          {/* Summary */}
          <div className="container summary-container">
            {generateSummary(content, overviewArticles)}
          </div>

          {/* Article */}
          <div className="container p-4 pt-0">
            {content.map((item, index) =>
              parseData(item, index, firstH1Index, setSelectedImage),
            )}
          </div>

          {/* Tree links */}
          {(() => {
            const treeLinkBlock = content.find(
              (item) => item.type === ArticleContentType.TREELINKINPUT,
            );

            let treeLinks = [];

            try {
              const parsedTreeLinks = JSON.parse(
                treeLinkBlock?.content || "[]",
              );

              treeLinks = Array.isArray(parsedTreeLinks) ? parsedTreeLinks : [];
            } catch {
              treeLinks = [];
            }

            return (
              <div className="tree-link-group">
                {treeLinks.map((item, index) => (
                  <a
                    key={item.link || index}
                    href={toRelativeUrl(item.link)}
                    className="article-nav-button article-cta"
                  >
                    Start Diagnosis
                  </a>
                ))}
              </div>
            );
          })()}

          {/* Image modal */}
          {selectedImage && (
            <div
              className="image-modal-overlay"
              onClick={() => setSelectedImage(null)}
              role="presentation"
            >
              <img
                src={selectedImage}
                alt="Enlarged"
                className="image-modal-content"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ArticleContent;
