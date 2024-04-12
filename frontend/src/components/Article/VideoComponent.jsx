import React from "react";
import styles from "./styles";

/**
 * VideoComponent renders a YouTube video player with the specified video ID.
 * @param {Object} props - The props object containing the video ID.
 * @param {string} props.videoId - The ID of the YouTube video to embed.
 * @returns {JSX.Element} - Returns the JSX element for the YouTube video player.
 */
const VideoComponent = ({ videoId }) => {
  return (
    <div style={styles.videoResponsive}>
      {/* Embedded YouTube video player */}
      <iframe
        style={styles.videoResponsiveIframe}
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};

export default VideoComponent;
