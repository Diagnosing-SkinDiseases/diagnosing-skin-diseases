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

/**
 * Article is a component for creating and editing articles. It allows users to dynamically
 * add, update, and remove various types of content blocks, such as titles, subtitles, paragraphs,
 * images, and videos. This component fetches article data from a backend service when an article
 * ID is available and renders editable inputs for each content block of the article.
 *
 * Props:
 * - onUpdate (function): Callback function that is called whenever the article's content blocks
 *   are updated. It receives the updated array of content blocks as its argument.
 * 
 * @param {Function} props.onUpdate - Callback function to be called with updated content blocks.
 * @returns {JSX.Element} The rendered component.
 */
const Article = ({ onUpdate}) => {
  const [contentBlocks, setContentBlocks] = useState([{ type: ArticleContentType.TITLE, value: '' }]);
  const location = useLocation();
  const article = location.state?.id;

  /**
   * Converts a string to title case.
   *
   * @param {string} str - the input string
   * @return {string} the string converted to title case
   */
  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
  }
  
  /**
   * Parses the given article data to create an array of content blocks.
   *
   * @param {Object} data - The article data to be parsed.
   * @return {Array} An array of content blocks including the title block and content blocks.
   */
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

  /**
   * Fetches the article data from the backend when the article id is available
   * and updates the state with the parsed content blocks.
   */
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

  /**
   * Adds a content block of the specified type to the contentBlocks array.
   *
   * @param {type} type - the type of content block to add
   * @return {void} 
   */
  const addContentBlock = (type) => {
    setContentBlocks([...contentBlocks, { type, value: '' }]);
  };

  /**
   * Generate the updated blocks array with the change applied to the specific block
   *
   * @param {number} index - The index of the block to be updated
   * @param {string} type - The type of the block to be updated
   * @param {any} value - The new value for the block to be updated
   */
  const updateContentBlock = (index, type, value) => {
    const updatedBlocks = contentBlocks.map((block, i) => i === index ? { ...block, type, value } : block);
    setContentBlocks(updatedBlocks);
    onUpdate(updatedBlocks);
};

  const removeContentBlock = (index) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== index));
  };

  /**
   * Renders content input based on the block and index.
   *
   * @param {Object} block - The block object
   * @param {number} index - The index of the block
   * @return {JSX.Element} The rendered content input
   */
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

  /**
   * @returns The article component.
   */
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
