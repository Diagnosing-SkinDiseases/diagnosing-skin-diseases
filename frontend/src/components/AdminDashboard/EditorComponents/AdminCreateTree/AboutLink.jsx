import React from "react";

const AboutLink = ({ aboutLink, setAboutLink }) => {
  const handleTextChange = (event) => {
    setAboutLink(event.target.value);
  };

  return (
    <>
      <h3>About Article Link</h3>
      <div>
        <input
          type="text"
          className="white-bar-input"
          placeholder="Enter About Article Link"
          onChange={handleTextChange}
          value={aboutLink}
        />
      </div>
    </>
  );
};

export default AboutLink;
