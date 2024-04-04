import React, { useState } from 'react';
import labels from "../labels.json";
import '../../CSS/Admin/ImageParagraphGroup.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const ImageParagraphGroup = ({ contentLabel }) => {
  const [imageBase64, setImageBase64] = useState('');
  const [paragraph, setParagraph] = useState('');

  // Ref to the hidden file input
  const fileInputRef = React.useRef();

  // Trigger the hidden file input click event
  const onIconClick = () => {
    fileInputRef.current.click();
  };

  // Handles the change of the file input and convert the image to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
    }
  };

  // Handles changes in the paragraph textarea
  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  };

  const handleInput = (e) => {
    e.target.style.height = 'inherit'; // Reset the height - allows shrink if text is deleted
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height
  };

  return (
    <div className="image-upload-group">
      <div className="input-group image">
        <label htmlFor="file-upload" className="image-upload-label">
          <FontAwesomeIcon icon={faUpload} onClick={onIconClick} className="upload-icon" id = "upload-icon"/>
          <div className="upload-label-text">{labels.imageLabel}</div>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }} // Hide the file input
        />
        {imageBase64 && (
          <img src={imageBase64} alt="Preview" className="image-preview" />
        )}
      </div>
      <div className="input-group">
        <label htmlFor="paragraph" className="label">{contentLabel}</label>
        <textarea
          id="paragraph"
          value={paragraph}
          onChange={handleParagraphChange}
          onInput={handleInput} // Use the onInput event for auto-resizing
          className="autosize rounded-textarea"
        />
      </div>
    </div>
  );
};

export default ImageParagraphGroup;
