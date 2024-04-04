import React from 'react';
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import "../../CSS/Admin/Controls.css"; 

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
