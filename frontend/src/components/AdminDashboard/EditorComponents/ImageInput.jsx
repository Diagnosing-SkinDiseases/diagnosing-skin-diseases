import React, { useState, useEffect, useRef } from 'react';
import Button from '../GeneralComponents/Button';
import "../../CSS/Admin/List.css"; 
import labels from "../labels.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ImageInput = ({ block, updateBlock, remove }) => {
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    // If block.value is a base64 string and starts with 'data:image/', set it as the preview
    if (block.value && typeof block.value === 'string' && block.value.startsWith('data:image')) {
      setPreview(block.value);

    }
  }, [block.value]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        // Log the base64 string to console
        // console.log("image", reader.result);
        // updateBlock({ ...block, value: reader.result });
        updateBlock(reader.result );
      };
      reader.readAsDataURL(file);
    }
  };


  const handlePreviewClick = () => {
    fileInputRef.current.click();
  };

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
