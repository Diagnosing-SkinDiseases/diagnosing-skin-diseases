import React, { useState, useEffect } from "react";
import EditorButtons from "./EditorComponents/EditorButtons";
import ContentTypeEnum from "./enums/ContentTypeEnum";
import Definition from "./EditorComponents/Definition";
import Article from "./EditorComponents/Article";
import { useNavigate, useParams } from "react-router-dom";
import Tree from "./EditorComponents/Tree";
import "../CSS/Admin/List.css";
import "../CSS/Admin/AdminDashboard.css";
// API controllers for each content type
import {
  apiCreateGlossaryItem,
  apiUpdateGlossaryItem,
} from "../../apiControllers/glossaryItemApiController";
import {
  apiCreateArticle,
  apiUpdateArticle,
} from "../../apiControllers/articleApiController";
import {
  apiCreateTree,
  apiUpdateTree,
} from "../../apiControllers/treeApiController";

/**
 * ContentEditor is a component for creating and editing different types of content
 * such as definitions, articles, and trees.
 *
 * @param {string} contentType - The type of content being edited, which determines the form and API calls.
 */
const ContentEditor = ({ contentType }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [status, setStatus] = useState("");
  const [articleContent, setArticleContent] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const path = `/admin/${contentType.toLowerCase()}s`;

  // Tree State
  const [treePayload, setTreePayload] = useState(null);

  // Determine if we are in edit mode
  const isEditMode = id !== undefined;

  /**
   * Parses the article content to extract title and content.
   *
   * @param {array} articleContent - the content of the article to be parsed
   * @return {object} the parsed article content with title and content
   */
  const parseArticleContent = (articleContent) => {
    return {
      title: articleContent[0]?.value || "", // Ensure there is a default value
      content: articleContent.slice(1).map((item) => {
        return {
          type: item.type.toUpperCase(),
          content: item.value,
        };
      }),
    };
  };

  /**
   * Creates a parsed definition object with the given title and paragraph.
   *
   * @return {Object} - The parsed definition object with the term and definition properties.
   */
  const parsedDefinition = () => {
    return {
      term: title,
      definition: paragraph,
    };
  };

  /**
   * Checks if the form is ready to be saved based on the content type and its specific requirements.
   * Sets an error message if the form is not ready to be saved.
   *
   * @return {boolean} true if the form is ready to save, false otherwise
   */
  const isReadyToSave = () => {
    let message = "";
    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        const term = parsedDefinition().term;
        const definition = parsedDefinition().definition;
        if (!term || !definition) {
          message = "Please, provide term and definition.";
        }
        break;
      case ContentTypeEnum.ARTICLE:
        const title = parseArticleContent(articleContent).title;
        const content = parseArticleContent(articleContent).content;

        function hasEmptyValue(arr) {
          return (
            arr.some((element) => {
              console.log(element);

              return element.content === "";
            }) || arr.length === 0
          );
        }

        console.log(hasEmptyValue(content));

        // Check if any of the elements in the content array have an empty value or if the title is empty.

        if (!title || hasEmptyValue(content)) {
          message = "Please provide article title and content.";
        }
        break;
      case ContentTypeEnum.TREE:
        if (
          treePayload.name === "" ||
          treePayload.nodeTree.content === "" ||
          treePayload.coverImage === "" ||
          treePayload.aboutLink === ""
        ) {
          message =
            "Please, provide tree title, about link, cover image and at least the root node filled.";
        }
        break;
      default:
        message = "Unsupported content type.";
        break;
    }
    setErrorMessage(message);
    return !message; // Returns true if the message is empty, meaning the form is ready to save
  };

  /**
   * Updates the definition with the given title, paragraph, and status.
   *
   * @param {type} title - the title of the definition
   * @param {type} paragraph - the paragraph of the definition
   * @param {type} status - the status of the definition
   * @return {type} undefined
   */
  const handleDefinitionUpdate = (title, paragraph, status) => {
    setTitle(title);
    setParagraph(paragraph);
    setStatus(status);
  };

  /**
   * Handles updates to the article content by updating the component's state.
   *
   * @param {Array} updatedBlocks - The updated content blocks of the article.
   */
  const handleArticleUpdate = (updatedBlocks) => {
    // Handle the update accordingly
    setArticleContent(updatedBlocks);
  };

  /**
   * Renders the content based on the content type.
   *
   * @return {JSX.Element} The rendered content based on the content type.
   */
  const renderContent = () => {
    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        return <Definition status={status} onUpdate={handleDefinitionUpdate} />;
      case ContentTypeEnum.ARTICLE:
        return <Article onUpdate={handleArticleUpdate} />;
      case ContentTypeEnum.TREE:
        return <Tree existingId={id} setTreePayload={setTreePayload} />;
      default:
        return <div>Please select a content type.</div>;
    }
  };

  /**
   * Update an item with a new status and optional title or paragraph.
   *
   * @param {string} newStatus - the new status for the item
   * @return {void}
   */
  const updateItem = (newStatus) => {
    let updatedItem = {
      id: id,
      status: newStatus,
    };

    if (title !== "") {
      updatedItem.term = title;
    }

    if (paragraph !== "") {
      updatedItem.definition = paragraph;
    }

    let updatePromise;
    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        updatePromise = apiUpdateGlossaryItem(updatedItem);
        break;
      case ContentTypeEnum.ARTICLE:
        let parsedArticle = parseArticleContent(articleContent);
        parsedArticle.id = id;
        parsedArticle.status = newStatus;

        updatePromise = apiUpdateArticle(parsedArticle);
        break;
      case ContentTypeEnum.TREE:
        if (treePayload) {
          treePayload.id = id;
          treePayload.status = newStatus;
          updatePromise = apiUpdateTree(treePayload);
        } else {
          console.error("Invalid update payload");
          return;
        }
        break;
      default:
        console.error("Unknown content type for processing");
        return;
    }

    updatePromise
      .then((response) => {
        navigate(path);
      })
      .catch((error) => {
        console.error("Failed to update item:", error);
      });
  };

  /**
   * Creates an item based on the given status.
   *
   * @param {string} status - the status of the item to be created
   * @return {void}
   */
  const createItem = (status) => {
    let createPromise;
    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        let item = parsedDefinition();
        item.status = status;
        createPromise = apiCreateGlossaryItem(item);
        break;
      case ContentTypeEnum.ARTICLE:
        let parsedArticle = parseArticleContent(articleContent);
        parsedArticle.status = status;
        createPromise = apiCreateArticle(parsedArticle);
        break;
      case ContentTypeEnum.TREE:
        if (treePayload) {
          treePayload.status = status;
          createPromise = apiCreateTree(treePayload);
        } else {
          console.error("Invalid create payload");
          return;
        }
        break;
      default:
        console.error("Unknown content type for creation");
        return;
    }

    createPromise
      .then((response) => {
        navigate(path); // Redirect to the list view after creation
      })
      .catch((error) => {
        console.error("Failed to create item:", error);
      });
  };

  /**
   * Handles the save or update action.
   *
   */
  const handleSaveOrUpdateBtn = () => {
    const status = "UNPUBLISHED";
    if (isEditMode) {
      updateItem(status);
    } else {
      createItem(status);
    }
  };

  /**
   * Handles the publish button action.
   */
  const handlePublishBtn = () => {
    const publishStatus = "PUBLISHED";
    if (isEditMode) {
      updateItem(publishStatus);
    } else {
      createItem(publishStatus);
    }
  };

  /**
   * Handling the preview button click event.
   */
  const handlePreviewBtn = () => {
    let previewPath = "";
    let previewData = {};

    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        previewPath = `/admin/definitions/preview`;
        previewData = parsedDefinition();
        break;
      case ContentTypeEnum.ARTICLE:
        previewPath = `/admin/articles/preview`;
        previewData = parseArticleContent(articleContent);
        break;
      case ContentTypeEnum.TREE:
        previewPath = `/admin/trees/preview`;
        // Helper function
        const inOrderToList = (node, acc) => {
          if (node) {
            let { parentId, content, currentId, yesChild, noChild } = node;
            let parsedNode = { currentId, content, parentId };
            parsedNode.noChildId = noChild ? noChild.currentId : null;
            parsedNode.yesChildId = yesChild ? yesChild.currentId : null;
            acc.push(parsedNode);
            inOrderToList(node.noChild, acc);
            inOrderToList(node.yesChild, acc);
          }
          return acc;
        };
        previewData = treePayload;
        previewData.nodes = inOrderToList(previewData.nodeTree, []);
        break;
      default:
        console.error("Unknown content type.");
        return;
    }
    sessionStorage.setItem("previewData", JSON.stringify(previewData));
    const url = `${window.location.origin}${previewPath}`;
    window.open(url, "_blank");
  };

  /**
   * @returns {JSX.Element} The rendered admin dashboard's editor section.
   */
  return (
    <div className="admin-dashboard">
      <div className="editor">
        {renderContent()}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <EditorButtons
          onPreview={() => {
            if (isReadyToSave()) {
              handlePreviewBtn();
            }
          }}
          onSave={() => {
            if (isReadyToSave()) {
              handleSaveOrUpdateBtn();
            }
          }}
          onPublish={() => {
            if (isReadyToSave()) {
              handlePublishBtn();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ContentEditor;
