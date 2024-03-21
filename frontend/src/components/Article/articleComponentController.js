import React from "react";
import ArticleContentType from "./enums";
import VideoComponent from "./VideoComponent";
import styles from "./styles";

const parseData = ({ type, content }) => {
  switch (type) {
    case ArticleContentType.HEADER1:
      return (
        <>
          <h3 style={styles.header1}>{content}</h3>
        </>
      );
    case ArticleContentType.HEADER2:
      return (
        <>
          <h3 style={styles.header2}>{content}</h3>
        </>
      );
    case ArticleContentType.PARAGRAPH:
      const parsedContent = content.replace(
        /<a href="(.*?)">(.*?)<\/a>/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
      );
      return (
        <>
          <p dangerouslySetInnerHTML={{ __html: parsedContent }} />
        </>
      );
    case ArticleContentType.IMAGE:
      return (
        <>
          <div className="container">
            <img
              src={`${content}`}
              alt="Converted"
              className="d-block w-50 mx-auto"
            />
          </div>
        </>
      );
    case ArticleContentType.VIDEO:
      function extractYouTubeVideoID(url) {
        const regExp =
          /^.*(youtu\.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
          return match[2];
        } else {
          // Handle cases where the URL does not contain a valid YouTube video ID
          return null;
        }
      }

      let videoId = extractYouTubeVideoID(content);
      return (
        <>
          <VideoComponent videoId={videoId}></VideoComponent>
        </>
      );
    case ArticleContentType.SUBTITLE:
      return (
        <>
          <p style={styles.subtitle}>{content}</p>
        </>
      );
    default:
      console.log("No match");
      break;
  }
};

export { parseData };