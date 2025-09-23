import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ArticleContentType from "../enums/ArticleContentType";
import ContentInput from "./ContentInput";
import ImageInput from "./ImageInput";
import VideoInput from "./VideoInput";
import Button from "../GeneralComponents/Button";
import labels from "../labels.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faVideo,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import { apiGetArticle } from "../../../apiControllers/articleApiController";

// Drag and Drop imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Custom Button Container Component
const ButtonContainer = ({ addContentBlockAfter, index }) => {
  return (
    <div className="add-content-btn-container">
      <Button
        className="button add-content-btn"
        label={labels.buttonLabels.add.title}
        onClick={() => addContentBlockAfter(index, ArticleContentType.HEADER1)}
      />
      <Button
        className="button add-content-btn"
        label={labels.buttonLabels.add.subtitle}
        onClick={() => addContentBlockAfter(index, ArticleContentType.HEADER2)}
      />
      <Button
        className="button add-content-btn"
        label={labels.buttonLabels.add.subtype}
        onClick={() => addContentBlockAfter(index, ArticleContentType.SUBTYPE)}
      />
      <Button
        className="button add-content-btn"
        label={labels.buttonLabels.add.paragraph}
        onClick={() =>
          addContentBlockAfter(index, ArticleContentType.PARAGRAPH)
        }
      />
      <Button
        className="button add-content-btn add-media-content-btn"
        onClick={() => addContentBlockAfter(index, ArticleContentType.IMAGE)}
      >
        <FontAwesomeIcon icon={faImage} />
      </Button>
      <Button
        className="button add-content-btn add-media-content-btn"
        onClick={() => addContentBlockAfter(index, ArticleContentType.VIDEO)}
      >
        <FontAwesomeIcon icon={faVideo} />
      </Button>
    </div>
  );
};

// Custom Wrapper Component for Draggable context
const SortableBlock = ({
  id,
  index,
  block,
  selectedContent,
  setSelectedContent,
  renderContentInput,
  addContentBlockAfter,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-block">
      <div className="drag-handle" {...listeners} {...attributes}>
        <FontAwesomeIcon icon={faGripVertical} />
      </div>

      <div style={{ flexGrow: 1 }} onClick={() => setSelectedContent(index)}>
        {renderContentInput(block, index)}

        {selectedContent === index && (
          <ButtonContainer
            addContentBlockAfter={addContentBlockAfter}
            index={index}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Article is a component for creating and editing articles. It allows users to dynamically
 * add, update, and remove various types of content blocks, such as titles, subtitles, paragraphs,
 * images, and videos. This component fetches article data from a backend service when an article
 * ID is available and renders editable inputs for each content block of the article.
 *
 * @param {Function} props.onUpdate - Callback function to be called with updated content blocks.
 * @returns {JSX.Element} The rendered component.
 */
const Article = ({ onUpdate }) => {
  const [contentBlocks, setContentBlocks] = useState([
    { type: ArticleContentType.TITLE, value: "" },
  ]);
  const location = useLocation();
  const article = location.state?.id;
  const [selectedContent, setSelectedContent] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    console.log("Selected content index:", selectedContent);
  }, [selectedContent]);

  /**
   * Converts a string to title case.
   *
   * @param {string} str - the input string
   * @return {string} the string converted to title case
   */
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  /**
   * Parses the given article data to create an array of content blocks.
   *
   * @param {Object} data - The article data to be parsed.
   * @return {Array} An array of content blocks including the title block and content blocks.
   */
  const parseArticleData = (data) => {
    const titleBlock = [
      {
        type: ArticleContentType.TITLE,
        value: data.title,
      },
    ];

    const contentBlocks = data.content.map((block) => ({
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
      apiGetArticle(article)
        .then((response) => {
          const parsedContent = parseArticleData(response.data);
          let i = 0;
          parsedContent.forEach((block) => {
            renderContentInput(block, i);
            i++;
          });
          setContentBlocks(parsedContent);
          onUpdate(parsedContent);
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
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
    setContentBlocks([...contentBlocks, { type, value: "" }]);
  };

  /**
   * Generate the updated blocks array with the change applied to the specific block
   *
   * @param {number} index - The index of the block to be updated
   * @param {string} type - The type of the block to be updated
   * @param {any} value - The new value for the block to be updated
   */
  const updateContentBlock = (index, type, value) => {
    const updatedBlocks = contentBlocks.map((block, i) =>
      i === index ? { ...block, type, value } : block
    );
    setContentBlocks(updatedBlocks);
    onUpdate(updatedBlocks);
  };

  /**
   * Removes the content block at the specified index from the contentBlocks array.
   *
   * @param {number} index - The index of the block to be removed
   * @return {void}
   */
  const removeContentBlock = (index) => {
    const updatedBlocks = contentBlocks.filter((_, i) => i !== index);
    setContentBlocks(updatedBlocks);
    onUpdate(updatedBlocks); // Update the parent component with the new state
  };

  /**
   * Renders content input based on the block and index.
   *
   * @param {Object} block - The block object
   * @param {number} index - The index of the block
   * @return {JSX.Element} The rendered content input
   */
  const renderContentInput = (block, index) => {
    const isDefaultTitle =
      index === 0 && block.type === ArticleContentType.TITLE;
    const blockClassName = isDefaultTitle ? "default-title" : "";

    const handleSelect = () => setSelectedContent(index);

    const contentInputProps = {
      index: index,
      block: block,
      updateBlock: (value) => updateContentBlock(index, block.type, value),
      remove: () => removeContentBlock(index),
      className: `${blockClassName} ${
        selectedContent === index ? "selected" : ""
      }`,
      onClick: handleSelect,
      selectedContent: selectedContent,
    };

    switch (block.type) {
      case ArticleContentType.TITLE:
      case ArticleContentType.SUBTITLE:
      case ArticleContentType.HEADER1:
      case ArticleContentType.HEADER2:
      case ArticleContentType.SUBTYPE:
      case ArticleContentType.PARAGRAPH:
        return <ContentInput {...contentInputProps} key={index} />;
      case ArticleContentType.IMAGE:
        return <ImageInput {...contentInputProps} key={index} />;
      case ArticleContentType.VIDEO:
        return <VideoInput {...contentInputProps} key={index} />;
      default:
        return null;
    }
  };

  const addContentBlockAfter = (index, type) => {
    const newBlocks = [
      ...contentBlocks.slice(0, index + 1),
      { type, value: "" },
      ...contentBlocks.slice(index + 1),
    ];
    setContentBlocks(newBlocks);
    onUpdate(newBlocks);
  };

  function moveBlock(dragIndex, hoverIndex) {
    const updatedBlocks = [...contentBlocks];
    const [movedBlock] = updatedBlocks.splice(dragIndex, 1);
    updatedBlocks.splice(hoverIndex, 0, movedBlock);
    setContentBlocks(updatedBlocks);
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = active.id;
    const newIndex = over.id;

    if (oldIndex !== newIndex) {
      const reordered = arrayMove(contentBlocks, oldIndex, newIndex);
      setContentBlocks(reordered);
      onUpdate(reordered);
    }
  };

  /**
   * @returns The article component.
   */
  return (
    <div>
      {renderContentInput(contentBlocks[0], 0)}

      {selectedContent === 0 && (
        <ButtonContainer
          addContentBlockAfter={addContentBlockAfter}
          index={0}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={contentBlocks
            .map((_, index) => index)
            .filter((index) => index !== 0)}
          strategy={verticalListSortingStrategy}
        >
          {contentBlocks.slice(1).map((block, index) => (
            <SortableBlock
              key={index + 1}
              id={index + 1}
              index={index + 1}
              block={block}
              selectedContent={selectedContent}
              setSelectedContent={setSelectedContent}
              renderContentInput={renderContentInput}
              addContentBlockAfter={addContentBlockAfter}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Article;
