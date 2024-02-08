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


export default Controls;
