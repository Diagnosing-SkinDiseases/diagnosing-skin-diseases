import React, { useState } from "react";

const Sidebar = ({ setArticleId }) => {
  const [selectedItem, setSelectedItem] = useState("About DSD");

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  return (
    <div className="col-md-3 mt-4">
      <div className="list-group mt-4">
        <button
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "About DSD" ? "active" : ""
          }`}
          onClick={() => {
            handleItemClick("About DSD");
            setArticleId("660e30352dc5942805a1372d");
          }}
        >
          About DSD
        </button>
        <button
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Using This Website" ? "active" : ""
          }`}
          onClick={() => {
            handleItemClick("Using This Website");
            setArticleId("660e303a2dc5942805a137c0");
          }}
        >
          Using This Website
        </button>
        <button
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Acknowledgements" ? "active" : ""
          }`}
          onClick={() => {
            handleItemClick("Acknowledgements");
            setArticleId("660e303f2dc5942805a13854");
          }}
        >
          Acknowledgements
        </button>
        <button
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Contact" ? "active" : ""
          }`}
          onClick={() => {
            handleItemClick("Contact");
            setArticleId("660e30442dc5942805a138e9");
          }}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
