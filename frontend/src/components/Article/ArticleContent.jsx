import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ArticleContentType from "./enums";
import VideoComponent from "./VideoComponent";
import styles from "./styles";
import { parseData } from "./articleComponentController";

const ArticleContent = ({ data: { title, content } }) => {
  const { hash } = useLocation();

  /**
   * Handles hash navigation withing the article.
   * - hash: The current hash value from the URL, to identify the target section.
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
