import React, { useState, useEffect, useRef } from 'react';
import Button from '../GeneralComponents/Button';
import "../styles/List.css"; 
import labels from "../labels.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * * ImageInput is a React component for uploading, previewing, and removing images within a form or content block.
 * It provides a user interface for selecting an image file, displaying a preview of the image, and allowing the
 * user to remove the image. 
 * 
 * @param {Object} props.block - The content block object with a 'value' property for the image.
 * @param {Function} props.updateBlock - Callback to update the block's value with the selected image.
 * @param {Function} props.remove - Callback to remove the image from the block.
 * @returns {JSX.Element} The rendered ImageInput component.
 */
const ImageInput = ({ block, updateBlock, remove }) => {
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef();

  /**
   * Setts the preview of the image to the selected image.
   * 
   * @listens block.value - Watches for changes in the block's value to update the image preview accordingly.
   */
  useEffect(() => {
    // If block.value is a base64 string and starts with 'data:image/', set it as the preview
    if (block.value && typeof block.value === 'string' && block.value.startsWith('data:image')) {
      setPreview(block.value);

    }
  }, [block.value]);

  /**
   * Handles the change event of an image input element.
   *
   * @param {event} e - the event object
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        updateBlock(reader.result );
      };
      reader.readAsDataURL(file);
    }
  };


  /**
   * Triggers the file input
   */
  const handlePreviewClick = () => {
    fileInputRef.current.click();
  };

  /**
   * Returns the image input element with a preview and upload button.
   */
  return (
    <div className="image-input-container">
      {preview ? (
        <img src={preview} alt="Preview" className="image-preview" onClick={handlePreviewClick} />
      ) : (
        <label className="image-upload-label" onClick={handlePreviewClick}>
            <FontAwesomeIcon icon={faUpload} className="fa-upload-icon" />
            <div className="upload-label-text">{labels.imageLabel}</div>
        </label>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        ref={fileInputRef}/>
        <Button onClick={remove} className="delete-button">
            <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
    </div>
    );
};

export default ImageInput;
