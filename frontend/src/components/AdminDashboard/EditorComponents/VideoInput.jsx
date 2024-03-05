import React from 'react';
import Button from '../GeneralComponents/Button';
import "../styles/List.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const VideoInput = ({ block, updateBlock, remove }) => {
  const handleChange = (e) => {
    updateBlock(e.target.value); 
  };

  const getEmbedUrl = (url) => {
    // A basic function to convert a YouTube URL to an embed URL
    // This should be expanded to handle different URL formats and video services
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url; // If not a YouTube URL, return the original URL
  };

   return (
    <div className="video-input-container">
  {block.value && (
    <div className="video-container">
      <iframe 
            src={getEmbedUrl(block.value)} 
            frameBorder="0" 
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
            className="video-preview"
          ></iframe>
    </div>
  )}
  <div className="input-row">
    <input
      type="text"
      value={block.value}
      onChange={handleChange}
      placeholder="Enter video URL"
      className="video-url-input"
    />
    <Button onClick={remove} className="delete-button">
      <FontAwesomeIcon icon={faTrashAlt} />
    </Button>
  </div>
</div>
  );
};

export default VideoInput;
