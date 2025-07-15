import React from "react";
import Button from "../GeneralComponents/Button";
import ArticleContentType from "../enums/ArticleContentType";
import "../../CSS/Admin/List.css";
import "../../CSS/Admin/Editor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

/**
 * ContentInput is a component for rendering and managing individual content blocks within an article.
 * It supports various types of content blocks, including titles, headers, subtitles, and paragraphs. Each block
 * can be edited, and changes are propagated through the `updateBlock` callback. The component also provides
 * a delete button to remove the block from the article.
 *
 * @param {Object} props.block - The content block object to be rendered.
 * @param {Function} props.updateBlock - Callback to update the block value.
 * @param {Function} props.remove - Callback to remove the block.
 * @param {String} [props.className] - Optional CSS class for additional styling.
 * @returns {JSX.Element} The JSX rendering of the content input block.
 */
const ContentInput = ({ block, updateBlock, remove, className, onClick }) => {
  const handleChange = (e) => {
    updateBlock(e.target.value);
  };

  const renderInput = (type = "text", id, placeholder) => (
    <input
      id={id}
      type={type}
      value={block.value}
      onChange={handleChange}
      onClick={onClick}
      placeholder={placeholder}
    />
  );

  const renderContentByType = () => {
    switch (block.type) {
      case ArticleContentType.TITLE:
        return (
          <div className="art-title">
            {renderInput("text", "art-title", "Title")}
          </div>
        );
      case ArticleContentType.HEADER1:
        return (
          <div className="art-title">
            <label className="label">Title</label>
            {renderInput("text", "title", "Title")}
          </div>
        );
      case ArticleContentType.HEADER2:
      case ArticleContentType.SUBTITLE:
        return (
          <div className="art-subtitle">
            <label className="label">Subtitle</label>
            {renderInput("text", "subtitle", "Subtitle")}
          </div>
        );
      case ArticleContentType.PARAGRAPH:
        return (
          <div className="art-paragraph">
            <label className="label">Paragraph</label>
            <textarea
              value={block.value}
              onChange={handleChange}
              onClick={onClick}
              placeholder="Paragraph"
              rows={4}
            />
          </div>
        );
      default:
        return null;
    }
  };

  /**
   * @returns The content input component.
   */
  return (
    <div className={`content-input-wrapper ${className}`}>
      <div className={`content-input ${className}`}>
        {renderContentByType()}
      </div>
      <div className="delete-button-container">
        <Button onClick={remove} className="delete-button">
          <FontAwesomeIcon icon={faTrashAlt} className="fa-trash-alt" />
        </Button>
      </div>
    </div>
  );
};

export default ContentInput;
