import React, { useState } from "react";
import EditorButtons from "./EditorComponents/EditorButtons";
import ContentTypeEnum from "./ContentTypeEnum";
import Definition from "./EditorComponents/Definition";
import Article from "./EditorComponents/Article";
// import Tree from './EditorComponents/Tree';
import "./styles/List.css";
import "./styles/AdminDashboard.css";
import { apiCreateGlossaryItem } from "../../glossaryItemApiController";
import { useNavigate } from "react-router-dom";

// ContentEditor Component
const TestGlossaryContentEditor = () => {
  // State hooks for title and paragraph
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");

  const navigate = useNavigate();

  // Handle publishing
  const onPublish = async () => {
    const payload = {
      term: title,
      definition: paragraph,
      status: "published",
    };
    await apiCreateGlossaryItem(payload);
    navigate("/test/admin/definitions");
  };

  return (
    <div className="admin-dashboard">
      <div className="editor">
        {
          <Definition
            title={title}
            setTitle={setTitle}
            paragraph={paragraph}
            setParagraph={setParagraph}
          ></Definition>
        }
        <EditorButtons
          onPreview={console.log("Preview")}
          onSave={console.log("Save")}
          onPublish={onPublish}
        />
      </div>
    </div>
  );
};

export default TestGlossaryContentEditor;
