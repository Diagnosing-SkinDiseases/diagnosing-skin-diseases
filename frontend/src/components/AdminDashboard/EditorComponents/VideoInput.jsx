import React from "react";
import Button from "../GeneralComponents/Button";
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

  function extractVimeoIframeSrc(input) {
    // If they pasted just a URL, accept it directly.
    try {
      const u = new URL(input.trim());
      if (u.hostname.includes("vimeo.com")) return u.toString();
    } catch {}

    // Prefer DOM parsing (browser)
    if (typeof window !== "undefined" && "DOMParser" in window) {
      const doc = new DOMParser().parseFromString(String(input), "text/html");
      const iframe = doc.querySelector('iframe[src*="vimeo.com"]');
      if (iframe) {
        let src = iframe.getAttribute("src") || "";
        src = src.replace(/&amp;/g, "&").trim(); // decode entities
        try {
          return new URL(src, "https://player.vimeo.com").toString();
        } catch {
          return src;
        }
      }
    }

    // Fallback: regex
    const m = String(input).match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (m) {
      let src = m[1].replace(/&amp;/g, "&").trim();
      try {
        return new URL(src, "https://player.vimeo.com").toString();
      } catch {
        return src;
      }
    }

    return null; // not found
  }

  /**
   * @returns {JSX.Element} The rendered video input.
   */
  return (
    <div className="video-input-container">
      {block.value && (
        <div className="video-container">
          <iframe
            src={extractVimeoIframeSrc(block.value)}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="video-preview"
            title={`Embedded video: ${block.value}`}
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
