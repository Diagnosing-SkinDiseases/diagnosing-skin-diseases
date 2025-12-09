import React, { useEffect, useState } from "react";
import ArticleContent from "./ArticleContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

/**
 * ArticleBG component renders the background layout for an article,
 * including the article content and navigation buttons.
 * @param {Object} data - The data object containing article content.
 * @returns {JSX.Element} - Returns the JSX element for the article background.
 */
const ArticleBG = ({ data, errorMsg }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Start diagnosis button component for certain cases
  const ToTreeButton = () => {
    const treeId = searchParams.get("treeId");
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
      <div className="container pb-5 mt-5">
        <div className="row justify-content-center article-container">
          <ArticleContent data={data} errorMsg={errorMsg}></ArticleContent>
        </div>

        {/* Bottom Navigation Row */}
        <div className="row justify-content-between mt-3 px-2">
          {/* Bottom-left button */}
          <button className="article-nav-button" onClick={() => navigate("/")}>
            All Diagnostic Trees
          </button>

          {/* Bottom-right button (only when applicable) */}
          {searchParams.get("treeId") && <ToTreeButton />}
        </div>
      </div>
    </>
  );
};

export default ArticleBG;
