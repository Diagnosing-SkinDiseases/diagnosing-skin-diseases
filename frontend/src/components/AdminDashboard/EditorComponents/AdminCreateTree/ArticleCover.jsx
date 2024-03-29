import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ArticleCover = ({ setCoverImage }) => {
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <h3>Tree Cover Image</h3>
      <div className="image-input-container">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="image-preview"
            onClick={handlePreviewClick}
          />
        ) : (
          <label className="image-upload-label" onClick={handlePreviewClick}>
            <FontAwesomeIcon icon={faUpload} className="fa-upload-icon" />
            <div className="upload-label-text">Upload Image</div>
          </label>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
      </div>
    </>
  );
};

export default ArticleCover;
