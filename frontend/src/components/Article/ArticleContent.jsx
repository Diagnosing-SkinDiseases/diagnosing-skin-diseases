import React from "react";
import ContentType from "./enums";

const parseData = ({ type, content }) => {
  switch (type) {
    case ContentType.HEADER:
      return (
        <>
          <h3 className="article-h3">{content}</h3>
        </>
      );
    case ContentType.TEXT:
      return (
        <>
          <p>{content}</p>
        </>
      );
    case ContentType.IMAGE:
      return (
        <>
          <div className="container">
            <img
              src={content}
              alt="Converted"
              className="d-block w-50 mx-auto"
            />
          </div>
        </>
      );
    default:
      console.log("No match");
      break;
  }
};

const ArticleContent = ({ data: { title, totalContent } }) => {
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
          {totalContent.map(parseData)}
        </div>
      </div>
    </>
  );
};

export default ArticleContent;
