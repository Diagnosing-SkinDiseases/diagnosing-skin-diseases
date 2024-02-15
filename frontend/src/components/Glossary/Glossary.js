import React, { useState } from "react";
import "./Glossary.css";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import GlossaryContent from "./GlossaryContent";

function App() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const glossaryItems = [
    { term: "Lorem", definition: "Lorem ipsum dolor sit amet..." },
    { term: "Ipsum", definition: "Ipsum is simply dummy text..." },
    { term: "Dolor", definition: "Dolor sit amet, consectetur..." },
    { term: "Sit", definition: "Sit amet, consectetur adipiscing..." },
    { term: "Amet", definition: "Amet, consectetur adipiscing elit..." },
    { term: "Consectetur", definition: "Consectetur adipiscing elit..." },
    { term: "Adipiscing", definition: "Adipiscing elit..." },
    { term: "Elit", definition: "Elit, sed do eiusmod tempor..." },
    { term: "Sed", definition: "Sed do eiusmod tempor incididunt..." },
    { term: "Do", definition: "Do eiusmod tempor incididunt ut..." },
    { term: "Eiusmod", definition: "Eiusmod tempor incididunt ut labore..." },
    { term: "Tempor", definition: "Tempor incididunt ut labore et..." },
    { term: "Incididunt", definition: "Incididunt ut labore et dolore..." },
    { term: "Ut", definition: "Ut labore et dolore magna..." },
    { term: "Labore", definition: "Labore et dolore magna aliqua..." },
    { term: "Et", definition: "Et dolore magna aliqua..." },
    { term: "Dolore", definition: "Dolore magna aliqua..." },
    { term: "Magna", definition: "Magna aliqua..." },
    { term: "Aliqua", definition: "Aliqua..." },
  ];

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
