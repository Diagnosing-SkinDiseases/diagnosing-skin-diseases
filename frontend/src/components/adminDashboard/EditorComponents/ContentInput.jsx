import React from 'react';
import Button from '../GeneralComponents/Button';
import ArticleContentType from '../enums/ArticleContentType';
import "../styles/List.css"; 
import "../styles/Editor.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ContentInput = ({ block, updateBlock, remove, className }) => {
  const handleChange = (e) => {
    updateBlock(e.target.value);
  };

  const renderContentByType = () => {
    switch (block.type) {
      case ArticleContentType.TITLE:
        return <div className="art-title"><input type="text" value={block.value} onChange={handleChange} placeholder="Title" /></div>;
      case ArticleContentType.SUBTITLE:
        return <div className="art-subtitle"><input type="text" value={block.value} onChange={handleChange} placeholder="Subtitle" /></div>;
      case ArticleContentType.PARAGRAPH:
        return <div className="art-paragraph"><textarea value={block.value} onChange={handleChange} placeholder="Paragraph" rows={4} /></div>;
      default:
        return null;
    }
  };

  return (
    <div className={`content-input-wrapper ${className}`}>
        <div className={`content-input ${className}`}>
              {renderContentByType()}
              
        </div>
        <Button onClick={remove} className="delete-button">
            <FontAwesomeIcon icon={faTrashAlt} className="fa-trash-alt" />
              </Button>
    </div>
  );
};

export default ContentInput;
