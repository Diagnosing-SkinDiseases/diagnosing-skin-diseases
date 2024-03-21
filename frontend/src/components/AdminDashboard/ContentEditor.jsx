import React, { useState, useEffect} from 'react';
import EditorButtons from './EditorComponents/EditorButtons';
import ContentTypeEnum from './enums/ContentTypeEnum';
import Definition from './EditorComponents/Definition';
import Article from './EditorComponents/Article';
import { useNavigate, useParams } from 'react-router-dom';
// import Tree from './EditorComponents/Tree';
import "./styles/List.css"; 
import "./styles/AdminDashboard.css"; 
// API controllers for each content type
import { apiCreateGlossaryItem, apiUpdateGlossaryItem } from "../../apiControllers/glossaryItemApiController";
import { apiCreateArticle, apiUpdateArticle } from "../../apiControllers/articleApiController";

// ContentEditor Component
const ContentEditor = ({ contentType }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [status, setStatus] = useState('');
  const [articleContent, setArticleContent] = useState([]);
  const path = `/admin/${contentType.toLowerCase()}s`; 

  // Determine if we are in edit mode
  const isEditMode = id  !== undefined;

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
        return <Definition status = {status} onUpdate={handleDefinitionUpdate} />;
      case ContentTypeEnum.ARTICLE:
        return <Article onUpdate={handleArticleUpdate}/>;
      case ContentTypeEnum.TREE:
        // return <Tree />;
        return;
      default:
        return <div>Please select a content type.</div>;
    }
  };

 

  const updateItem = (newStatus) => {
    let updatedItem = {
      id: id,
      status: newStatus
    };

    if (title !== "") {
      updatedItem.term = title;
    }

    if (paragraph !== "") {
      updatedItem.definition = paragraph;
    }

    let updatePromise;
    switch (contentType) {
      case "Definition":
        updatePromise = apiUpdateGlossaryItem(updatedItem);
        break;
      case "Article":
        const parsedArticle = {
          id: id,
          title: articleContent[0].value, 
          content: articleContent.slice(1).map(item => ({ 
            type: item.type.toUpperCase(),
            content: item.value
          })),
          status: newStatus
        };
        console.log("payload", parsedArticle);
        updatePromise = apiUpdateArticle(parsedArticle);
        break;
      case "Tree":
        // updatePromise = updateTree(updatedItem);
        break;
      default:
        console.log("Unknown content type for processing");
        return;
    }

    updatePromise.then(response => {
    console.log("Item updated:", response);
    navigate(path);
  }).catch(error => {
    console.error("Failed to update item:", error);
  });
  }

  const createItem = (status) => {
    let item = {
      term: title,
      definition: paragraph,
      status: status
    }
    let createPromise;
    switch (contentType) {
    case ContentTypeEnum.DEFINITION:
      createPromise = apiCreateGlossaryItem(item);
      break;
      case ContentTypeEnum.ARTICLE:
        console.log("adding article");
        const parsedArticle = {
          title: articleContent[0].value, 
          content: articleContent.slice(1).map(item => ({ 
            type: item.type.toUpperCase(),
            content: item.value
          })),
          status: status
        };
      createPromise = apiCreateArticle(parsedArticle);
      break;
    case ContentTypeEnum.TREE:
      // createPromise = createTree(item);
      break;
    default:
      console.log("Unknown content type for creation");
      return;
    }
    
     createPromise.then(response => {
    console.log("Item created:", response);
    navigate(path); // Redirect to the list view after creation
  }).catch(error => {
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
  }

  const handlePublishBtn = () => {
    console.log("status", status);
    const publishStatus = "PUBLISHED";
    if (isEditMode) {
      updateItem(publishStatus);
    } else {
      createItem(publishStatus);
    }
  }

  const handlePreviewBtn = () => {
    // console.log("Preview");
  }

  return (
    <div className="admin-dashboard">
      <div className="editor">
        {renderContent()}
        <EditorButtons 
          onPreview={handlePreviewBtn} 
          onSave={handleSaveOrUpdateBtn} 
          onPublish={handlePublishBtn} 
        />
      </div>
    </div>
  );
};

export default ContentEditor;