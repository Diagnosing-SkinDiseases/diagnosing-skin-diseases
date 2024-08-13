import React from "react";
import ArticleContentType from "./enums";
import VideoComponent from "./VideoComponent";
import styles from "./styles";

/**
 * parseData function parses the article content based on its type.
 * @param {Object} data - The data object containing type and content of the article element.
 * @param {number} index - The index of the article element.
 * @returns {JSX.Element|null} - Returns the JSX element corresponding to the parsed article element, or null if no match.
 */
const parseData = ({ type, content }, index) => {
  switch (type) {
    case ArticleContentType.HEADER1:
    case ArticleContentType.HEADER2:
      return (
        <div key={index} id={content}>
          <hr /> {/* Horizontal separator/line */}
          <h2>{content}</h2>
        </div>
      );
    case ArticleContentType.PARAGRAPH:
      // Replace anchor tags with target="_blank" attribute for opening links in new tab
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
      // Function to extract YouTube video ID from URL
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
        <div className="user-article-video-container">
          <VideoComponent key={index} videoId={videoId}></VideoComponent>
        </div>
      );
    case ArticleContentType.SUBTITLE:
      return (
        <p key={index} style={styles.subtitle}>
          {content}
        </p>
      );
    default:
      return null;
  }
};

/**
 * generateSummary function creates a summary with hyperlinks to headers within the article.
 * @param {Array} content - An array containing objects representing different types of content in the article.
 * @returns {JSX.Element} - Returns a JSX element for the summary.
 */
const generateSummary = (content) => {
  return (
    <ul className="summary-list">
      {content
        .filter(
          (item) =>
            item.type === ArticleContentType.HEADER1 ||
            item.type === ArticleContentType.HEADER2
        )
        .map(({ content }, index) => (
          <li key={index}>
            <a href={`#${content}`} className="summary-link">
              {content}
            </a>
          </li>
        ))}
    </ul>
  );
};

export { parseData, generateSummary };
