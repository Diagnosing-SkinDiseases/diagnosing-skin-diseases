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
  const location = useLocation();
  const [previousUrl, setPreviousUrl] = useState(null);

  // Store document.referrer once on mount
  useEffect(() => {
    const referrer = document.referrer;
    setPreviousUrl(referrer);
    const currentUrl =
      window.location.pathname + window.location.search + window.location.hash;

    console.log("Stored Previous URL (on mount):", referrer);
    console.log("Current URL (useEffect):", currentUrl);
  }, []);

  const handleBack = () => {
    const currentUrl =
      window.location.pathname + window.location.search + window.location.hash;

    console.log("Previous URL (handleBack):", previousUrl);
    console.log("Current URL (handleBack):", currentUrl);

    if (previousUrl) {
      window.location.href = previousUrl;
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/", { replace: true });
    }
  };

  // Back button component for certain cases
  const BackButton = () => {
    const pathname = location.pathname;
    if (pathname === "/about" || pathname.includes("/preview")) {
      return null;
    }

    return (
      <button className="article-nav-button button" onClick={handleBack}>
        Previous
      </button>
    );
  };

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
        <div className="row justify-content-between mt-3 px-2">
          <BackButton></BackButton>
          {searchParams.get("treeId") && <ToTreeButton />}
        </div>
      </div>
    </>
  );
};

export default ArticleBG;
