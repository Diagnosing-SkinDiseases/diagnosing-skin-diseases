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
    const url = new URL(window.location.href);
    const isPreviewMode = url.pathname.includes("/admin/definitions/preview");

    apiGetAllGlossaryItems()
      .then((response) => {
        // Filter items to only include those with status "PUBLISHED"
        let publishedItems = response.data.filter(
          (item) => item.status === "PUBLISHED"
        );

        if (isPreviewMode) {
          const previewDataString = sessionStorage.getItem("previewData");
          if (previewDataString) {
            const previewData = JSON.parse(previewDataString);
            // Check if previewData already exists in publishedItems by id or another unique property
            const previewDataExists = publishedItems.some(
              (item) => item.term === previewData.term
            ); 
            if (!previewDataExists) {
              publishedItems = [...publishedItems, previewData];
            }
            setSearchTerm(previewData.term);
            handleSelectItem(previewData);
          }
        }

        setGlossaryItems(publishedItems);
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
