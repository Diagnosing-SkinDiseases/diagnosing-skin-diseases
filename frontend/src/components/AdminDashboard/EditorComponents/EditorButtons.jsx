import React from 'react';
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import "../styles/Controls.css"; 

/**
 * Generates editor buttons for preview, save, and publish actions.
 *
 * @param {function} onPreview - Function to handle preview action
 * @param {function} onSave - Function to handle save action
 * @param {function} onPublish - Function to handle publish action
 * @return {JSX.Element} Editor buttons component
 */
const EditorButtons = ({ onPreview, onSave, onPublish }) => {
  return (
    <div className="buttons">
      <Button
        label={labels.contentEditorBtns.preview}
        onClick={onPreview}
        className="button"
      />
      <Button
        label={labels.contentEditorBtns.save}
        onClick={onSave}
        className="button"
      />
      <Button
        label={labels.contentEditorBtns.publish}
        onClick={onPublish}
        className="button"
      />
    </div>
  );
};

export default EditorButtons;
