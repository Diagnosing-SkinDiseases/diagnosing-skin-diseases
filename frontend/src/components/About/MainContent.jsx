import React from "react";
import Article from "../Article/Article";

const MainContent = ({ articleId }) => {
  return (
    <div className="col-md-9">
      <Article articleId={articleId}></Article>
    </div>
  );
};

export default MainContent;
