import React from "react";
import ArticleContentType from "./enums";
import VideoComponent from "./VideoComponent";
import styles from "./styles";

const parseData = ({ type, content }, index) => {
  switch (type) {
    case ArticleContentType.HEADER1:
      return <h2 key={index}>{content}</h2>;
    case ArticleContentType.HEADER2:
      return <h3 key={index}>{content}</h3>;
    case ArticleContentType.PARAGRAPH:
      const parsedContent = content.replace(
        /<a href="(.*?)">(.*?)<\/a>/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
      );
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: parsedContent }} />
      );
    case ArticleContentType.IMAGE:
      return (
        <div key={index} className="container">
          <img
            src={`${content}`}
            alt="Converted"
            className="d-block w-25 mx-auto"
          />
        </div>
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
      return <VideoComponent key={index} videoId={videoId}></VideoComponent>;
    case ArticleContentType.SUBTITLE:
      return (
        <p key={index} style={styles.subtitle}>
          {content}
        </p>
      );
    default:
      console.log("No match");
      break;
  }
};

export { parseData };
