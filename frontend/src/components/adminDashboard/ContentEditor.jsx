import React from 'react';
import EditorButtons from './EditorComponents/EditorButtons';
import ContentTypeEnum from './ContentTypeEnum';
import Definition from './EditorComponents/Definition';
import Article from './EditorComponents/Article';
// import Tree from './EditorComponents/Tree';
import "./styles/List.css"; 
import "./styles/AdminDashboard.css"; 

// ContentEditor Component
const ContentEditor = ({ contentType }) => {
  // Helper function to render the content based on the contentType
  const renderContent = () => {
    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        return <Definition />;
      case ContentTypeEnum.ARTICLE:
        return <Article />;
      case ContentTypeEnum.TREE:
        // return <Tree />;
      default:
        return <div>Please select a content type.</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="editor">
        {renderContent()}
        <EditorButtons 
          onPreview={console.log("Preview")} 
          onSave={console.log("Save")} 
          onPublish={console.log("Publish")} 
        />
      </div>
    </div>
  );
};

export default ContentEditor;
