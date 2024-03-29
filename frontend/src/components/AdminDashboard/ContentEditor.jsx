import React, { useState, useEffect } from "react";
import EditorButtons from "./EditorComponents/EditorButtons";
import ContentTypeEnum from "./enums/ContentTypeEnum";
import Definition from "./EditorComponents/Definition";
import Article from "./EditorComponents/Article";
import { useNavigate, useParams } from "react-router-dom";
import Tree from "./EditorComponents/Tree";
import "./styles/List.css";
import "./styles/AdminDashboard.css";
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

// ContentEditor Component
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

  const parseArticleContent = (articleContent) => {
    return {
      title: articleContent[0]?.value || "", // Ensure there is a default value
      content: articleContent.slice(1).map((item) => ({
        type: item.type.toUpperCase(),
        content: item.value,
      })),
    };
  };

  const parsedDefinition = () => {
    return {
      term: title,
      definition: paragraph,
    };
  };

  const isReadyToSave = () => {
    let message = "";
    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        if (!title.trim() || !paragraph.trim()) {
          message = "Please, provide term and definition.";
        }
        break;
      case ContentTypeEnum.ARTICLE:
        const title = parseArticleContent(articleContent).title;
        const content = parseArticleContent(articleContent).content;
        if (!title || content.length === 0) {
          message = "Please, provide article title and content.";
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

  // Update parent state based on child component updates
  const handleDefinitionUpdate = (title, paragraph, status) => {
    setTitle(title);
    setParagraph(paragraph);
    setStatus(status);
  };

  const handleArticleUpdate = (updatedBlocks) => {
    console.log("updatedBlocks", updatedBlocks);
    // Handle the update accordingly
    setArticleContent(updatedBlocks);
  };

  // Helper function to render the content based on the contentType
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
        console.log("payload", parsedArticle);
        updatePromise = apiUpdateArticle(parsedArticle);
        break;
      case ContentTypeEnum.TREE:
        if (treePayload) {
          treePayload.id = id;
          treePayload.status = newStatus;
          updatePromise = apiUpdateTree(treePayload);
        } else {
          console.log("Invalid update payload");
          return;
        }
        break;
      default:
        console.log("Unknown content type for processing");
        return;
    }

    updatePromise
      .then((response) => {
        console.log("Item updated:", response);
        navigate(path);
      })
      .catch((error) => {
        console.error("Failed to update item:", error);
      });
  };

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
          console.log("Invalid create payload");
          return;
        }
        break;
      default:
        console.log("Unknown content type for creation");
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

  const handleSaveOrUpdateBtn = () => {
    const status = "UNPUBLISHED";
    if (isEditMode) {
      updateItem(status);
    } else {
      createItem(status);
    }
  };

  const handlePublishBtn = () => {
    console.log("status", status);
    const publishStatus = "PUBLISHED";
    if (isEditMode) {
      updateItem(publishStatus);
    } else {
      createItem(publishStatus);
    }
  };

  const handlePreviewBtn = () => {
    let previewPath = "";
    let previewData = {};

    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        previewPath = `/admin/definitions/preview`;
        previewData = parsedDefinition();
        console.log("Parsed definition", previewData);
        break;
      case ContentTypeEnum.ARTICLE:
        previewPath = `/admin/articles/preview`;
        previewData = parseArticleContent(articleContent);
        break;
      case ContentTypeEnum.TREE:
        previewPath = `/admin/trees/preview`;
        // Helper function
        const inOrderToList = (node, acc) => {
          console.log("Node", node);
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
        console.log("treeview", previewData);
        break;
      default:
        console.log("Unknown content type.");
        return;
    }
    sessionStorage.setItem("previewData", JSON.stringify(previewData));
    const url = `${window.location.origin}${previewPath}`;
    window.open(url, "_blank");
  };

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
