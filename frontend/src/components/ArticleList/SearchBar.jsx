import React, { useState } from 'react';

/**
 * SearchBar Component
 * 
 * Provides an input field for users to type search terms. The component handles its own state for the input
 * value and notifies the parent component when a search should be executed, typically upon form submission.
 *
 * Props:
 *   onSearch (Function): A callback function provided by the parent component that is called when
 *                        the form is submitted. It receives the current search term as an argument.
 *
 * State:
 *   searchTerm (String): The current value of the search input field. It is updated as the user types.
 *
 * Behavior:
 *   - The input field captures user keystrokes and updates the component's state (`searchTerm`).
 *   - When the user submits the form (either by pressing Enter or clicking the search button),
 *     the `handleSubmit` function is called, which prevents the default form action and then
 *     calls `onSearch` with the current `searchTerm`.
 *   - `handleSubmit` ensures that the parent component is notified of the search action without
 *     causing a page reload, adhering to typical single-page application (SPA) behavior.
 */
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

