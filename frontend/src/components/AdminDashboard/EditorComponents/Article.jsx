import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ArticleContentType from '../enums/ArticleContentType';
import ContentInput from './ContentInput';
import ImageInput from './ImageInput';
import VideoInput from './VideoInput';
import Button from '../GeneralComponents/Button';
import labels from '../labels.json';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import { apiGetArticle } from '../../../apiControllers/articleApiController';
const Article = ({ onUpdate}) => {
  const [contentBlocks, setContentBlocks] = useState([{ type: ArticleContentType.TITLE, value: '' }]);
  const location = useLocation();
  const article = location.state?.id;
  console.log("id ", article);

  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
  }
  const parseArticleData = (data) => {
    const titleBlock = [{
      type: ArticleContentType.TITLE,
      value: data.title
    }];

    const contentBlocks = data.content.map(block => ({
      type: toTitleCase(block.type),
      value: block.content,
    }));

    return [...titleBlock, ...contentBlocks];
  };

  useEffect(() => {
    if (article) {
      apiGetArticle(article).then((response) => {
        console.log(response.data);
        const parsedContent = parseArticleData(response.data);
        console.log("parsedContent ", parsedContent);
        let i = 0;
        parsedContent.forEach(block => {
          renderContentInput(block, i);
          i++;
        });
        setContentBlocks(parsedContent);
        onUpdate(parsedContent);
      })
        .catch((error) => {
          console.error('Error fetching article:', error);
        });
    }
  }, [article]);

  const addContentBlock = (type) => {
    setContentBlocks([...contentBlocks, { type, value: '' }]);
  };

  const updateContentBlock = (index, type, value) => {
    // Generate the updated blocks array with the change applied to the specific block
    const updatedBlocks = contentBlocks.map((block, i) => i === index ? { ...block, type, value } : block);

    console.log("updatedBlock", updatedBlocks);
    setContentBlocks(updatedBlocks);

    onUpdate(updatedBlocks);
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
      // updateBlock: (value) => updateContentBlock(index, value),
      updateBlock: (value) => updateContentBlock(index, block.type, value),
      remove: () => removeContentBlock(index),
      className: blockClassName, 
    };
    switch (block.type) {
      case ArticleContentType.TITLE:
      case ArticleContentType.SUBTITLE:
      case ArticleContentType.HEADER1:
      case ArticleContentType.HEADER2:
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
        onClick={() => addContentBlock(ArticleContentType.HEADER1)}
        className="button add-content-btn">
              </Button>
              <Button
        label={labels.buttonLabels.add.subtitle}
        onClick={() => addContentBlock(ArticleContentType.HEADER2)}
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
