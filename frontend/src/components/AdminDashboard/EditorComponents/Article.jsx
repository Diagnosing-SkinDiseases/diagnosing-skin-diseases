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
import TreeLinkInput from "./TreeLinkInput";

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
// --------------------------------------------------------
// Main Article Component
// --------------------------------------------------------
const Article = ({ onUpdate }) => {
  const [contentBlocks, setContentBlocks] = useState([
    { type: ArticleContentType.TITLE, value: "" },
    { type: ArticleContentType.TREELINKINPUT, value: "[]" },
  ]);

  const location = useLocation();
  const article = location.state?.id;
  const [selectedContent, setSelectedContent] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const parseArticleData = (data) => {
    const titleBlock = [{ type: ArticleContentType.TITLE, value: data.title }];

    const contentBlocks = data.content.map((block) => ({
      type: toTitleCase(block.type),
      value: block.content,
    }));

    return [...titleBlock, ...contentBlocks];
  };

  // --------------------------------------------------------
  // Ensure TreeLink exists at index 1
  // --------------------------------------------------------
  const ensureTreeLinkBlock = (blocks) => {
    console.log("Blocks:", blocks);

    // Find any TreeLinkInput regardless of casing
    const existingIndex = blocks.findIndex(
      (b) => b.type && b.type.toLowerCase() === "treelinkinput"
    );

    // CASE 1 — No TreeLinkInput exists at all
    if (existingIndex === -1) {
      const treeLinkBlock = {
        type: ArticleContentType.TREELINKINPUT, // uppercase always
        value: "[]",
      };

      // Insert after title
      if (blocks.length >= 1) {
        return [blocks[0], treeLinkBlock, ...blocks.slice(1)];
      }

      // If somehow no title exists (rare)
      return [treeLinkBlock];
    }

    // CASE 2 — A Treelinkinput exists → normalize its type only
    const newBlocks = [...blocks];
    newBlocks[existingIndex] = {
      ...newBlocks[existingIndex],
      type: ArticleContentType.TREELINKINPUT,
    };

    return newBlocks;
  };

  // Load existing article
  useEffect(() => {
    if (article) {
      apiGetArticle(article)
        .then((response) => {
          let parsedContent = parseArticleData(response.data);
          parsedContent = ensureTreeLinkBlock(parsedContent);

          setContentBlocks(parsedContent);
          onUpdate(parsedContent);
        })
        .catch((error) => console.error("Error fetching article:", error));
    }
  }, [article]);

  const updateContentBlock = (index, type, value) => {
    const updated = contentBlocks.map((b, i) =>
      i === index ? { ...b, type, value } : b
    );
    setContentBlocks(updated);
    onUpdate(updated);
  };

  const removeContentBlock = (index) => {
    const updated = contentBlocks.filter((_, i) => i !== index);
    const corrected = ensureTreeLinkBlock(updated);
    setContentBlocks(corrected);
    onUpdate(corrected);
  };

  const addContentBlockAfter = (index, type) => {
    // Ensure TreeLink stays at index 1 no matter what
    const insertionIndex = index < 1 ? index + 1 : index + 1;

    // But do NOT allow inserting BETWEEN Title and TreeLink
    // i.e. do not insert at index 1
    const safeIndex = insertionIndex === 1 ? 2 : insertionIndex;

    const newBlocks = [
      ...contentBlocks.slice(0, safeIndex),
      { type, value: "" },
      ...contentBlocks.slice(safeIndex),
    ];

    setContentBlocks(newBlocks);
    onUpdate(newBlocks);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = active.id;
    const newIndex = over.id;

    if (oldIndex !== newIndex) {
      const draggableBlocks = contentBlocks.slice(2);
      const moved = arrayMove(draggableBlocks, oldIndex - 2, newIndex - 2);

      const updated = [contentBlocks[0], contentBlocks[1], ...moved];

      setContentBlocks(updated);
      onUpdate(updated);
    }
  };

  // --------------------------------------------------------
  // Rendering
  // --------------------------------------------------------
  const renderContentInput = (block, index) => {
    const isFixedTitle = index === 0 && block.type === ArticleContentType.TITLE;
    const blockClassName = isFixedTitle ? "default-title" : "";

    const handleSelect = () => setSelectedContent(index);

    const props = {
      index,
      block,
      updateBlock: (value) => updateContentBlock(index, block.type, value),
      remove: () => removeContentBlock(index),
      className: `${blockClassName} ${
        selectedContent === index ? "selected" : ""
      }`,
      onClick: handleSelect,
      selectedContent,
    };

    switch (block.type) {
      case ArticleContentType.TITLE:
      case ArticleContentType.SUBTITLE:
      case ArticleContentType.HEADER1:
      case ArticleContentType.HEADER2:
      case ArticleContentType.SUBTYPE:
      case ArticleContentType.PARAGRAPH:
        return <ContentInput {...props} key={index} />;
      case ArticleContentType.IMAGE:
        return <ImageInput {...props} key={index} />;
      case ArticleContentType.VIDEO:
        return <VideoInput {...props} key={index} />;
      case ArticleContentType.TREELINKINPUT:
        return <TreeLinkInput {...props} key={index} />;
      default:
        return null;
    }
  };

  // Logging
  useEffect(() => {
    console.log("contentblocks", contentBlocks);
  }, [contentBlocks]);

  return (
    <div>
      {/* Title at index 0 */}
      {renderContentInput(contentBlocks[0], 0)}

      {/* TreeLink fixed at index 1 */}
      {contentBlocks[1] && renderContentInput(contentBlocks[1], 1)}

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
        {/* Only blocks AFTER index 1 are draggable */}
        <SortableContext
          items={contentBlocks.map((_, i) => i).filter((i) => i > 1)}
          strategy={verticalListSortingStrategy}
        >
          {contentBlocks.slice(2).map((block, idx) => (
            <SortableBlock
              key={idx + 2}
              id={idx + 2}
              index={idx + 2}
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
