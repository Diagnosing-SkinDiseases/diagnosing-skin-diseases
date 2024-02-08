import React, { useState } from "react";
import labels from "./labels.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Controls = ({ onAdd, onFilterChange, onSearch }) => {
  const [filter, setFilter] = useState("all");
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event);
    onFilterChange(event);
  };

  const handleSearchChange = (event) => {
    setInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(input);
  };

  return (
    <div className="controls">
      <AddButton
        label={labels.buttonLabels.add.tree}
        onClick={() => onAdd("tree")}
      />
      <FilterComponent
        labels={labels}
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  );
};

const AddButton = ({ label, onClick }) => {
  return (
    <button onClick={onClick} className="add-button">
      {label}
    </button>
  );
};

const FilterComponent = ({ labels, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

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

export default Controls;
