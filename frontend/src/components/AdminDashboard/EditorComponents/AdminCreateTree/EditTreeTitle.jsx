import React from "react";

const EditTreeTitle = ({ title, setTitle }) => {
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <div className="title-section">
        <div>
          <h3>Tree Name</h3>
          <input
            className="white-bar-input"
            type="text"
            placeholder="Enter Tree Name"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
      </div>
    </>
  );
};

export default EditTreeTitle;
