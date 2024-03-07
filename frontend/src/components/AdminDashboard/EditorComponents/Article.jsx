import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ArticleContentType from '../enums/ArticleContentType';
import ContentInput from './ContentInput';
import ImageInput from './ImageInput';
import VideoInput from './VideoInput';
import Button from '../GeneralComponents/Button';
import labels from '../labels.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";

const Article = () => {
  const [contentBlocks, setContentBlocks] = useState([{ type: ArticleContentType.TITLE, value: '' }]);
    
  const addContentBlock = (type) => {
    setContentBlocks([...contentBlocks, { type, value: '' }]);
  };

  const updateContentBlock = (index, value) => {
    const updatedBlocks = contentBlocks.map((block, i) => {
      if (i === index) {
        return { ...block, value };
      }
      return block;
    });
    setContentBlocks(updatedBlocks);
  };

  const removeContentBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  const renderContentInput = (block, index) => {
      const isDefaultTitle = index === 0 && block.type === ArticleContentType.TITLE;
      const blockClassName = isDefaultTitle ? 'default-title' : '';
    const contentInputProps = {
      key: index,
      block: block,
      updateBlock: (value) => updateContentBlock(index, value),
      remove: () => removeContentBlock(index),
      className: blockClassName, 
    };

    switch (block.type) {
      case ArticleContentType.TITLE:
      case ArticleContentType.SUBTITLE:
      case ArticleContentType.PARAGRAPH:
        return <ContentInput {...contentInputProps} />;
      case ArticleContentType.IMAGE:
        return <ImageInput {...contentInputProps} />;
      case ArticleContentType.VIDEO:
        return <VideoInput {...contentInputProps} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {contentBlocks.map((block, index) => renderContentInput(block, index))}
          <div className ="add-content-btn-container">
              <Button
        label={labels.buttonLabels.add.title}
        onClick={() => addContentBlock(ArticleContentType.TITLE)}
        className="button add-content-btn">
              </Button>
              <Button
        label={labels.buttonLabels.add.subtitle}
        onClick={() => addContentBlock(ArticleContentType.SUBTITLE)}
        className="button add-content-btn">
              </Button>
              <Button
        label={labels.buttonLabels.add.paragraph}
        onClick={() => addContentBlock(ArticleContentType.PARAGRAPH)}
                  className="button add-content-btn">
              </Button>
              <Button
        onClick={() => addContentBlock(ArticleContentType.IMAGE)}
                  className="add-content-btn add-media-content-btn ">
                  <FontAwesomeIcon icon={faImage} className="fa-add-content" />
              </Button>
              <Button
        onClick={() => addContentBlock(ArticleContentType.VIDEO)}
                  className="add-content-btn add-media-content-btn ">
                  <FontAwesomeIcon icon={faVideo} className="fa-add-content" />
              </Button>
      </div>
    </div>
  );
};

export default Article;
