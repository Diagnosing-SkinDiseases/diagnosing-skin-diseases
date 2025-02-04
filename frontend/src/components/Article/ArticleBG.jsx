import React from "react";
import ArticleContent from "./ArticleContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * ArticleBG component renders the background layout for an article,
 * including the article content and navigation buttons.
 * @param {Object} data - The data object containing article content.
 * @returns {JSX.Element} - Returns the JSX element for the article background.
 */
const ArticleBG = ({ data, errorMsg }) => {
  // Get search params and navigate function from react-router-dom
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Back button component for certain cases
  const BackButton = () => {
    /**
     * Excluded paths:
     * - /about
     * - /preview
     */
    const pathname = new URL(window.location).pathname;
    if (pathname === "/about" || pathname.includes("/preview")) {
      return null;
    }

    return (
      <button
        className="article-nav-button button"
        onClick={() => window.history.back()}
      >
        Previous
      </button>
    );
  };

  // Start diagnosis button component for certain cases
  const ToTreeButton = () => {
    // Get treeId from search parameters
    const treeId = searchParams.get("treeId");
    // Render button to start diagnosis if treeId is available
    return (
      <button
        className="article-nav-button button"
        onClick={() => navigate(`/trees/${treeId}`)}
      >
        Start Diagnosis
      </button>
    );
  };

  return (
    <>
      {/* Background layout */}
      <div className="container pb-5 mt-5">
        <div className="row justify-content-center article-container">
          {/* Render article content */}
          <ArticleContent data={data} errorMsg = {errorMsg}></ArticleContent>
        </div>
        {/* Navigation buttons */}
        <div className="row justify-content-between mt-3 px-2">
          {/* Render BackButton component */}
          <BackButton></BackButton>
          {/* Render ToTreeButton component if treeId is available */}
          {searchParams.get("treeId") && <ToTreeButton />}
        </div>
      </div>
    </>
  );
};

export default ArticleBG;
