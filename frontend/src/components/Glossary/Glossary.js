import React, { useState, useEffect } from "react";
import { apiGetAllGlossaryItems } from "../../apiControllers/glossaryItemApiController";
import "../CSS/Glossary.css";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import GlossaryContent from "./GlossaryContent";
import LoadingPage from "../Loading/LoadingPage";

/**
 * App Component for Glossary Page
 *
 * Manages the state and interactions for a glossary page that displays a list of glossary items
 * filterable by letters and searchable by terms. It fetches glossary items from the server,
 * supports preview mode for admin users, and integrates with search and letter filtering components.
 *
 * State:
 *   selectedLetter (String): The currently selected letter for filtering glossary items.
 *   searchTerm (String): The current search term used to filter glossary items.
 *   selectedItems (Array): A list of selected or highlighted glossary items.
 *   glossaryItems (Array): The full list of glossary items fetched from the server.
 *
 * Effects:
 *   useEffect hook is used to fetch glossary items from the API and handle initial preview mode setup
 *   if accessed from an admin definitions preview path.
 */
function App() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [glossaryItems, setGlossaryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      })
      .catch((error) =>
        console.error("Error fetching glossary items: ", error)
      );
  }, []);

  // Updates searchTerm state from SearchBar input
  function handleSearch(term) {
    setSearchTerm(term);
    setSelectedLetter("");
  }

  // Updates selectedLetter state from LetterFilter component
  function handleSelectLetter(letter) {
    setSelectedLetter((currentLetter) =>
      currentLetter === letter ? "" : letter
    );
    setSearchTerm("");
  }

  // Toggle selection state of an item
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
        {isLoading ? (
          <LoadingPage></LoadingPage>
        ) : (
          <GlossaryContent
            items={glossaryItems}
            selectedLetter={selectedLetter}
            searchTerm={searchTerm}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
          />
        )}
      </div>
    </div>
  );
}

export default App;
