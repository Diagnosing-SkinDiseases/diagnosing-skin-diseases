import React, { useEffect, useState } from "react";

const Sidebar = ({ setArticleId, selectedArticleId }) => {
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    // Map articleId to selectedItem
    switch (selectedArticleId) {
      case "660e30352dc5942805a1372d":
        setSelectedItem("About DSD");
        break;
      case "660e303a2dc5942805a137c0":
        setSelectedItem("Using This Website");
        break;
      case "660e303f2dc5942805a13854":
        setSelectedItem("Acknowledgements");
        break;
      case "contact":
        setSelectedItem("Contact");
        break;
      default:
        setSelectedItem("About DSD");
    }
  }, [selectedArticleId]);

  const handleItemClick = (itemName) => {
    const articleIdMap = {
      "About DSD": "660e30352dc5942805a1372d",
      "Using This Website": "660e303a2dc5942805a137c0",
      "Acknowledgements": "660e303f2dc5942805a13854",
      "Contact": "contact",
    };
    setArticleId(articleIdMap[itemName]);
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
          onClick={() => handleItemClick("About DSD")}
        >
          About DSD
        </button>
        <button
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Using This Website" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Using This Website")}
        >
          Using This Website
        </button>
        <button
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Acknowledgements" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Acknowledgements")}
        >
          Acknowledgements
        </button>
        <button
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Contact" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Contact")}
        >
          Contact
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
