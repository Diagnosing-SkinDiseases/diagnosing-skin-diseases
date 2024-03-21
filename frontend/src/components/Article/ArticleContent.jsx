import React from "react";
import ArticleContentType from "./enums";
import VideoComponent from "./VideoComponent";
import styles from "./styles";
import { parseData } from "./articleComponentController";

const ArticleContent = ({ data: { title, content } }) => {
  return (
    <>
      {/* Content */}
      <div className="container px-5">
        {/* Title */}
        <div className="container mt-4 p-0 article-title text-center">
          <h1>{title}</h1>
          <hr></hr>
        </div>

        {/* Article */}
        <div className="container p-4 pt-2">
          {/* Dynamic Content*/}
          {content.map(parseData)}
        </div>
      </div>
    </>
  );
};

export default ArticleContent;
