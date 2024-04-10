import React, { useState, useCallback } from "react";
import labels from "../labels.json";
import Button from "../GeneralComponents/Button";
import ContentTypeEnum from "../enums/ContentTypeEnum";
import "../styles/Controls.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

/**
 * Controls component provides UI for adding new content, filtering, and searching within the content list.
 * 
 * @param {Function} props.onFilterChange - Callback function that is called when the filter option is changed.
 * @param {Function} props.onSearch - Callback function that is called when a search is performed.
 * @param {string} props.contentType - Type of content, determines the labels and actions for add button and filters.
 * @returns {JSX.Element} The Controls component.
 */
const Controls = ({ onFilterChange, onSearch, contentType }) => {
  const [filter, setFilter] = useState("all");
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);

  /**
   * Handles the "Add" action based on the content type. It navigates to the appropriate 
   * add page for the given content type. 
   */
  const handleAdd = useCallback(() => {
    const pathMap = {
      [ContentTypeEnum.TREE]: "/admin/trees/add",
      [ContentTypeEnum.ARTICLE]: "/admin/articles/add",
      [ContentTypeEnum.DEFINITION]: "/admin/definitions/add"
    };
    const path = pathMap[contentType] || console.log("Unknown content type");
    if (path) navigate(path);
  }, [contentType, navigate]);

  /**
   * Updates the local filter state 
   * 
   * @param {string} event - The new filter value selected by the user.
   * @return {void} 
   */
  const handleFilterChange = (event) => {
    setFilter(event);
    onFilterChange(event);
  };

  
  
  /**
   * A function that handles the change event for the search input.
   *
   * @param {Event} event - the event object
   * @return {void} 
   */
  const handleSearchChange = (event) => {
    setInput(event.target.value);
  };

  
  /**
   * Handles the submit event for the search form.
   *
   * @param {event} event - the event object
   * @return {void} 
   */
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(input);
  };

  /**
   * Renders the Controls component which includes an add button, filter dropdown, and search field.
   *
   * @returns {JSX.Element} The JSX markup for the Controls component.
   */
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

/**
 * The FilterComponent renders a dropdown menu allowing the user to select a filter option.
 * 
 * @param {Object} props.labels - An object containing label strings for the component, including options for the dropdown.
 * @param {string} props.value - The current value of the filter, used to set the initial selected option in the dropdown.
 * @param {Function} props.onChange - A callback function to be called with the new selected option when the selection changes.
 * @returns {JSX.Element} A dropdown menu for selecting a filter option.
 */
const FilterComponent = ({ labels, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  
  /**
   * Handles the dropdown toggle.
   * 
   * @returns {void}
   */
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  
  /**
   * Handles the selection of an option.
   *
   * @param {type} key - the key of the selected option
   * @return {type} no return value
   */
  const handleOptionSelect = (key) => {
    setSelectedOption(key);
    onChange(key);
    setIsOpen(false);
  };

  /**
   * Renders the dropdown menu for filter.
   * 
   * @returns {JSX.Element} The JSX filterdropwon component.
   */
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


/**
 * Renders a search field component with a search input and submit button.
 *
 * @param {object} value - The current value of the search input
 * @param {function} onChange - The function to handle changes in the search input
 * @param {function} onSubmit - The function to handle form submission
 * @param {string} placeholder - The placeholder text for the search input
 * @return {JSX.Element} The search field component
 */
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
