import React, { useState, useEffect } from "react";
import { apiGetAllGlossaryItems } from "../../apiControllers/glossaryItemApiController";
import "./Glossary.css";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import GlossaryContent from "./GlossaryContent";

function App() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [glossaryItems, setGlossaryItems] = useState([]);

  useEffect(() => {
    apiGetAllGlossaryItems()
      .then((response) => {
        setGlossaryItems(response.data);
      })
      .catch((error) =>
        console.error("Error fetching glossary items: ", error)
      );
  }, []);

  // Function to update searchTerm state from SearchBar
  function handleSearch(term) {
    setSearchTerm(term);
    setSelectedLetter(""); // Clear the selectedLetter when searching
  }

  // Function to update selectedLetter state from Selector
  function handleSelectLetter(letter) {
    setSelectedLetter((currentLetter) =>
      currentLetter === letter ? "" : letter
    );
    setSearchTerm(""); // Clear the searchTerm when selecting a letter
  }

  function handleSelectItem(item) {
    const index = selectedItems.findIndex(
      (selectedItem) => selectedItem.term === item.term
    );
    if (index > -1) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.term !== item.term)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }

  return (
    <div className="Glossary">
      <div className="banner"></div>
      <div className="content">
        <div className="glossary-header">
          <h1 className="glossary-title">Glossary</h1>
          <div className="search-bar-container">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <LetterFilter
          onSelectLetter={handleSelectLetter}
          selectedLetter={selectedLetter}
        />
        <GlossaryContent
          items={glossaryItems}
          selectedLetter={selectedLetter}
          searchTerm={searchTerm}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
        />
      </div>
    </div>
  );
}

export default App;
