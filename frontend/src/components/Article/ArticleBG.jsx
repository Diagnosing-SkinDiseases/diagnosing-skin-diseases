import React from "react";
import ArticleContent from "./ArticleContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams, useNavigate } from "react-router-dom";

const ArticleBG = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Back button for certain cases
  const BackButton = () => {
    if (new URL(window.location).pathname === "/about") {
      return;
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

  // To tree button for certain cases
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
      {/* Background */}
      <div className="container pb-5 mt-5">
        <div className="row justify-content-center article-container">
          <ArticleContent data={data}></ArticleContent>
        </div>
        <div className="row justify-content-between mt-3 px-2">
          <BackButton></BackButton>
          {searchParams.get("treeId") && ToTreeButton()}
        </div>
      </div>
    </>
  );
};

export default ArticleBG;
