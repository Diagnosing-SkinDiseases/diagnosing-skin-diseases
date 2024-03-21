import React from 'react';
import Button from '../GeneralComponents/Button';
import ArticleContentType from '../enums/ArticleContentType';
import "../styles/List.css"; 
import "../styles/Editor.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ContentInput = ({ block, updateBlock, remove, className }) => {
  const handleChange = (e) => {
    console.log("handleChange ", block);
    updateBlock(e.target.value);
  };

  const renderContentByType = () => {
    switch (block.type) {
      case ArticleContentType.TITLE:
        return <div className="art-title"><input id = "art-title" type="text" value={block.value} onChange={handleChange} placeholder="Title" /></div>;
      case ArticleContentType.HEADER1:
        return <div className="art-title"><label className="label">Title</label><input id = "title" type="text" value={block.value} onChange={handleChange} placeholder="Title" /></div>;
      case ArticleContentType.HEADER2:
      case ArticleContentType.SUBTITLE:
        return <div className="art-subtitle"><label className="label">Subtitle</label><input id = "subtitle" type="text" value={block.value} onChange={handleChange} placeholder="Subtitle" /></div>;
      case ArticleContentType.PARAGRAPH:
        return <div className="art-paragraph"><label className="label">Paragraph</label><textarea value={block.value} onChange={handleChange} placeholder="Paragraph" rows={4} /></div>;
      default:
        return null;
    }
  };

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
