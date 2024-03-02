import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submit action
    onSearch(searchTerm); // Pass the searchTerm to the parent component
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value); // Update the searchTerm state with the new input
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="  Search..."
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;

