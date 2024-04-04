import React, { useState } from "react";

const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState("About DSD");

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  return (
    <div className="col-md-3 mt-4">
      <div className="list-group">
        <a
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "About DSD" ? "active" : ""
          }`}
          onClick={() => handleItemClick("About DSD")}
        >
          About DSD
        </a>
        <a
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Using This Website" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Using This Website")}
        >
          Using This Website
        </a>
        <a
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Acknowledgements" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Acknowledgements")}
        >
          Acknowledgements
        </a>
        <a
          href="#"
          className={`list-group-item list-group-item-action ${
            selectedItem === "Contact" ? "active" : ""
          }`}
          onClick={() => handleItemClick("Contact")}
        >
          Contact
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
