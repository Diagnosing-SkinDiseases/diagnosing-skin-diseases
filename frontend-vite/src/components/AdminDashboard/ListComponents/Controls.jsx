import React, { useState } from "react";
import labels from "../labels.json";
// import Button from "../GeneralComponents/Button";
import ContentTypeEnum from "../enums/ContentTypeEnum";
import "../../CSS/Admin/Controls.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useCallback } from "react";

/**
 * Controls component provides UI for adding new content, filtering, and
 * searching within the content list.
 *
 * @param {Function} props.onFilterChange - Called when the filter changes.
 * @param {Function} props.onSearch - Called when a search is performed.
 * @param {string} props.contentType - Determines labels and the add route.
 * @returns {JSX.Element}
 */
const Controls = ({ onFilterChange, onSearch, contentType }) => {
  const [filter, setFilter] = useState("all");
  const [input, setInput] = useState("");

  // const navigate = useNavigate();

  // Currently unused. Preserved in case search result state is needed later.
  // const [searchResults, setSearchResults] = useState([]);

  const pathMap = {
    [ContentTypeEnum.TREE]: "/admin/trees/add",
    [ContentTypeEnum.ARTICLE]: "/admin/articles/add",
    [ContentTypeEnum.DEFINITION]: "/admin/definitions/add",
  };

  const addPath = pathMap[contentType];

  /*
   * Archived button navigation logic.
   *
   * Handles the "Add" action based on the content type. It navigates to the
   * appropriate add page for the given content type.
   */
  /*
  const handleAdd = useCallback(() => {
    const pathMap = {
      [ContentTypeEnum.TREE]: "/admin/trees/add",
      [ContentTypeEnum.ARTICLE]: "/admin/articles/add",
      [ContentTypeEnum.DEFINITION]: "/admin/definitions/add",
    };

    const path =
      pathMap[contentType] || console.error("Unknown content type");

    if (path) navigate(path);
  }, [contentType, navigate]);
  */

  /**
   * Updates the local filter state.
   *
   * @param {string} value - The new filter value.
   * @returns {void}
   */
  const handleFilterChange = (value) => {
    setFilter(value);
    onFilterChange(value);
  };

  /**
   * Handles changes to the search input.
   *
   * @param {Event} event - The input change event.
   * @returns {void}
   */
  const handleSearchChange = (event) => {
    setInput(event.target.value);
  };

  /**
   * Handles submission of the search form.
   *
   * @param {Event} event - The form submission event.
   * @returns {void}
   */
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(input);
  };

  return (
    <div className="controls-wrapper">
      <div className="controls">
        {/* Archived button implementation */}
        {/*
        <Button
          label={labels.buttonLabels.add[contentType.toLowerCase()]}
          onClick={handleAdd}
          className="button"
        />
        */}

        {addPath ? (
          <Link to={addPath} className="button add-content-button">
            {labels.buttonLabels.add[contentType.toLowerCase()]}
          </Link>
        ) : (
          <span className="button disabled" aria-disabled="true">
            Unknown content type
          </span>
        )}

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
 * The FilterComponent renders a dropdown menu allowing the user to select a
 * filter option.
 *
 * @param {Object} props.labels - Label strings and dropdown options.
 * @param {string} props.value - The current selected filter.
 * @param {Function} props.onChange - Called with the selected filter.
 * @returns {JSX.Element}
 */
const FilterComponent = ({ labels, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);

  /**
   * Toggles the dropdown.
   *
   * @returns {void}
   */
  const handleDropdownToggle = () => {
    setIsOpen((currentValue) => !currentValue);
  };

  /**
   * Selects a dropdown option.
   *
   * @param {string} key - The selected option key.
   * @returns {void}
   */
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
              {Object.entries(labels.filterOption).map(([key, optionLabel]) => (
                <li key={key} onClick={() => handleOptionSelect(key)}>
                  {optionLabel}
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
 * Renders a search field with an input and submit button.
 *
 * @param {string} props.value - Current input value.
 * @param {Function} props.onChange - Handles input changes.
 * @param {Function} props.onSubmit - Handles form submission.
 * @param {string} props.placeholder - Search input placeholder.
 * @returns {JSX.Element}
 */
const SearchField = ({ value, onChange, onSubmit, placeholder }) => {
  return (
    <form onSubmit={onSubmit} className="search-form">
      <button type="submit" className="search-button" aria-label="Search">
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
