import React from 'react';
import Button from '../GeneralComponents/Button';
import "../../CSS/Admin/List.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * The VideoInput component allows users to input a video URL, 
 * which then gets transformed into an embeddable video preview. 
 *
 * @param {Object} block - The video block to be rendered.
 * @param {Function} updateBlock - A function to update the state of the block with a new video URL.
 * @param {Function} remove - A function to remove the video block from its parent component.
 * @returns {JSX.Element} The rendered video input.
 */
const VideoInput = ({ block, updateBlock, remove }) => {
  /**
   * Handles changes to the input field, updating the block's value with the new video URL.
   * 
   * @param {Event} e - The input event triggering the change.
   */
  const handleChange = (e) => {
    updateBlock(e.target.value); 
  };

  /**
    * Converts a standard YouTube video URL into an embeddable URL format. 
   * 
   * @param {string} url - The video URL to be converted.
   * @returns {string} The embeddable URL if the input is a YouTube URL, otherwise the original URL.
   */
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

  /**
   * @returns {JSX.Element} The rendered video input.
   */
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
