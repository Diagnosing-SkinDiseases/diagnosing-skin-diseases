import React, { useState, useCallback } from "react";
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import ContentTypeEnum from "../enums/ContentTypeEnum";
import "../../CSS/Admin/Controls.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Controls component containing add button, filter component, and search field
const Controls = ({ onFilterChange, onSearch, contentType }) => {
  const [filter, setFilter] = useState("all");
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  // const [searchResults, setSearchResults] = useState([]);

  const handleAdd = useCallback(() => {
    const pathMap = {
      [ContentTypeEnum.TREE]: "/admin/trees/add",
      [ContentTypeEnum.ARTICLE]: "/admin/articles/add",
      [ContentTypeEnum.DEFINITION]: "/admin/definitions/add"
    };
    const path = pathMap[contentType] || console.log("Unknown content type");
    if (path) navigate(path);
  }, [contentType, navigate]);

  // Handles the change of the filter option
  const handleFilterChange = (event) => {
    setFilter(event);
    onFilterChange(event);
  };

  // Handles the change of the search input
  const handleSearchChange = (event) => {
    setInput(event.target.value);
  };

  // Handles the submit of the search
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(input);
  };

  return (
    <div className="controls-wrapper">
      <div className="controls">
        <Button label={labels.buttonLabels.add[contentType.toLowerCase()]} onClick={handleAdd} className="button" />
        <FilterComponent
          labels={labels}
          value={filter}
          onChange={handleFilterChange}
        />
        <SearchField
          value={input}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          placeholder={labels.searchPlaceholder}
        />
      </div>
    </div>
  );
};

// Filter component 
const FilterComponent = ({ labels, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  // Handles the toggle of the dropdown
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  // Handles the selection of an option
  const handleOptionSelect = (key) => {
    setSelectedOption(key);
    onChange(key);
    setIsOpen(false);
  };

  return (
    <div className="select-wrapper">
      <div
        className={`select ${isOpen ? "open" : ""}`}
        onClick={handleDropdownToggle}
      >
        <p className="select-option">{labels.filterOption[selectedOption]}</p>
        <span className="select-icon">&#9660;</span>
        {isOpen && (
          <div className="select-content-container">
            <ul className="select-content">
              {Object.entries(labels.filterOption).map(([key, value]) => (
                <li key={key} onClick={() => handleOptionSelect(key)}>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// SearchField component 
const SearchField = ({ value, onChange, onSubmit, placeholder }) => {
  return (
    <form onSubmit={onSubmit} className="search-form">
      <button className="search-button">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
      />
    </form>
  );
};


export default Controls;
