import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import labels from "../labels.json";
import "../styles/Editor.css";
import { apiGetGlossaryItem } from "../../../apiControllers/glossaryItemApiController";

/*
* The Definition is a component to view and edit a glossary term and its definition.
*
* Props:
*   - onUpdate (function): A callback function that is called with the updated title and definition.
*
* State:
*   - title (string): The term of the glossary.
*   - paragraph (string): The definition of the glossary term.
*/
const Definition = ({ onUpdate}) => {
  const location = useLocation(); // Get the location state
  const definition = location.state?.id; // Access the item passed in the state, if any

  // State hooks for title and paragraph
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');

  /**
   * useEffect hook to fetch a glossary item from the backend when the component mounts
   * If an item is passed in the state, use it to fetch the definition from the backend
   */
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

  /**
   * Handles changes in the title input field
   * Calls the onUpdate callback with the new title and the current paragraph
   * @param {object} e The event object
   */
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    const newTitle = e.target.value;
    onUpdate(newTitle, paragraph);
  };

  /**
   * Handles changes in the paragraph textarea
   * Calls the onUpdate callback with the current title and new paragraph
   * @param {object} e The event object
   */
  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
    const newParagraph = e.target.value;
    onUpdate(title, newParagraph);
  };

  /**
   * Handles changes in the paragraph textarea
   * Resizes the textarea to fit the content
   * @param {object} e The event object
   */
  const handleInput = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };


  /**
   * @return The definition component.
   * Contains a title input and a paragraph textarea.
   */
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
