import React, { useState } from 'react';
import labels from "../labels.json";
import ImageParagraphGroup from './ImageParagraphGroup';
import Button from "../GeneralComponents/Button";
import "../styles/Editor.css";

let groupId = 0; // Counter for group IDs

const createNewGroup = () => ({
  id: ++groupId, // Increment and assign a unique ID
  image: '',
  paragraph: ''
});

const Article = () => {
  // Initializes with one group
  const [groups, setGroups] = useState([createNewGroup()]); 
  // State hooks for title and paragraph
  const [title, setTitle] = useState('');

  const addGroup = () => {
    setGroups([...groups, createNewGroup()]);
  };

  const updateGroup = (index, data) => {
    const newGroups = groups.map((group) => {
      if (group.id === index) {
        return { ...group, ...data };
      }
      return group;
    });
    setGroups(newGroups);
  };

  const deleteGroup = (id) => {
    const newGroups = groups.filter((group) => group.id !== id);
    setGroups(newGroups);
  };

  // Handles the change in the title input field
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="article">
      <div className="input-group">
        <label htmlFor="article-title"  className="label">{labels.articlePlaceholders.title}</label>
        <input
          id="article-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      {groups.map((group) => (
        <div key={group.id} className="image-paragraph-group-wrapper"> 
          <ImageParagraphGroup
            contentLabel = {labels.articlePlaceholders.contentLabel}
            image={group.image}
            paragraph={group.paragraph}
            onImageUpload={(image) => updateGroup(group.id, { image })}
            onParagraphChange={(e) => updateGroup(group.id, { paragraph: e.target.value })}
          />
          {groups.length > 1 && (
            <Button
              label={labels.contentEditorBtns.deleteGroup}
              onClick={() => deleteGroup(group.id)}
              className="button delete-group-btn"
            />
          )}
        </div>
      ))}
      <Button
        label={labels.contentEditorBtns.addGroup}
        onClick={addGroup}
        className="button add-group-btn">
      </Button>
    </div>
  );
};

export default Article;
