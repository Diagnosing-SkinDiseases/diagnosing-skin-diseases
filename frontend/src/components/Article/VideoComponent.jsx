import React from "react";
import styles from "./styles";

/**
 * VideoComponent renders a YouTube video player with the specified video ID.
 * @param {Object} props - The props object containing the video ID.
 * @param {string} props.videoId - The ID of the YouTube video to embed.
 * @returns {JSX.Element} - Returns the JSX element for the YouTube video player.
 */
const VideoComponent = ({ videoSrc }) => {
  return (
    <div style={styles.videoResponsive}>
      {/* Embedded YouTube video player */}
      <iframe
        style={styles.videoResponsiveIframe}
        src={`${videoSrc}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );
};

export default VideoComponent;

/**    <div stle={styles.videResponsive}>
      <iframe
        src="https://player.vimeo.com/video/1109473308?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        title="3959710-uhd_4096_2160_25fps"
      ></iframe>
    </div> */
