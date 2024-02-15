import React from "react";
import ArticleContent from "./ArticleContent";
import "bootstrap/dist/css/bootstrap.min.css";

const ArticleBG = ({ data }) => {
  return (
    <>
      {/* Background */}
      <div className="container pb-5 mt-5">
        <div className="row justify-content-center article-container">
          <ArticleContent data={data}></ArticleContent>
        </div>
      </div>
    </>
  );
};

export default ArticleBG;
