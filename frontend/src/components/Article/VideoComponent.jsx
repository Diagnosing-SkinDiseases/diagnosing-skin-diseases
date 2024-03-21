import React from "react";
import styles from "./styles";

const VideoComponent = ({ videoId }) => {
  return (
    <div style={styles.videoResponsive}>
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
