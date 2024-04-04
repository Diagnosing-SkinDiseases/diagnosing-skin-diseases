import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import labels from "../labels.json";
import "../../CSS/Admin/Editor.css";
import { apiGetGlossaryItem } from "../../../apiControllers/glossaryItemApiController";

// The Definition component
const Definition = ({ onUpdate}) => {
  const location = useLocation(); // Use useLocation to access the current location object
  const definition = location.state?.id; // Access the item passed in the state, if any

  console.log("id ", definition);
  // State hooks for title and paragraph
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');

  // Initializes state 
  useEffect(() => {
    if (definition) {
      // fetch using getDefinition(id)
      apiGetGlossaryItem(definition).then((response) => {
        setTitle(response.data.term);
        setParagraph(response.data.definition);
        onUpdate(title, definition);
      })
        .catch((error) => {
          console.error('Error fetching definition:', error);
        });
    }
  }, [definition, onUpdate]);

  // Handles the change in the title input field
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    const newTitle = e.target.value;
    onUpdate(newTitle, paragraph);
    console.log(title);
  };

  // Handles the change in the paragraph textarea
  const handleParagraphChange = (e) => {
    setParagraph(e.target.value); // Update the paragraph state
    const newParagraph = e.target.value;
    onUpdate(title, newParagraph);
  };

  const handleInput = (e) => {
    e.target.style.height = 'inherit'; // Reset the height - allows shrink if text is deleted
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height
  };

  return (
    <div className="definition">
      <div className="input-group">
        <label htmlFor="definition-title"  className="label">{labels.definitionLabels.title}</label>
        <input
          id="definition-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="input-group content">
        <label htmlFor="definition-paragraph" className="label">{labels.definitionLabels.definition}</label>
        <textarea
          id="definition-paragraph"
          value={paragraph}
          onChange={handleParagraphChange}
          onInput={handleInput} // Use the onInput event for auto-resizing
          className="autosize rounded-textarea"
        />
      </div>
    </div>
  );
};

export default Definition; 
