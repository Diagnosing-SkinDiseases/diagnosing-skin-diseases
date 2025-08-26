import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGetAllGlossaryItems } from "../../apiControllers/glossaryItemApiController";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import GlossaryContent from "./GlossaryContent";
import LoadingPage from "../Loading/LoadingPage";
import ErrorMessage from "../Error/ErrorMessage";
import messages from "../App/messages";
import dData from "./glossaryListDummyData.json";

// Styles
import "../CSS/GlossaryList.css";

const dummyData = dData;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const GlossaryListPage = () => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [glossaryItems, setGlossaryItems] = useState([]);
  const [originalGlossaryItems, setOriginalGlossaryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [expandedItems, setExpandedItems] = useState([]); // Track expanded items

  // Toggle the definition display for an item by _id
  const handleToggleExpand = (itemId) => {
    setExpandedItems(
      (prevExpandedItems) =>
        prevExpandedItems.includes(itemId)
          ? prevExpandedItems.filter((id) => id !== itemId) // Collapse if already expanded
          : [...prevExpandedItems, itemId] // Expand if not already expanded
    );
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const isPreviewMode = url.pathname.includes("/admin/definitions/preview");
    apiGetAllGlossaryItems()
      .then((response) => {
        // Filter items to only include those with status "PUBLISHED"
        let publishedItems = response.data.filter(
          (item) => item.status === "PUBLISHED"
        );

        // Group glossaryItems by the first letter of their term
        const groupedGlossaryItems = publishedItems.reduce(
          (acc, glossaryItem) => {
            const firstLetter = glossaryItem.term[0].toUpperCase();
            if (!acc[firstLetter]) {
              acc[firstLetter] = [];
            }
            // Store an object with title and _id in each group
            acc[firstLetter].push({
              term: glossaryItem.term,
              definition: glossaryItem.definition,
              _id: glossaryItem._id,
            });
            return acc;
          },
          {}
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

        // Use dummy or fetched data

        // setGlossaryItems(dummyData);
        // setOriginalGlossaryItems(dummyData);
        setGlossaryItems(groupedGlossaryItems);
        setOriginalGlossaryItems(groupedGlossaryItems);
        setIsLoading(false);
      })
      .catch((error) =>
        console.error("Error fetching glossary items: ", error)
      );
  }, []);

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

  // Calculate total content count
  const totalContent = Object.values(glossaryItems).reduce(
    (acc, items) => acc + items.length,
    0
  );
  const columnTarget = Math.floor((totalContent / 3) * 0.8);

  const columns = [[], [], []];
  let currentColumn = 0;
  let currentCount = 0;
  let switchColumnNext = false; // Flag to indicate if we should switch columns on the next section

  // Sequentially distribute content
  Object.keys(glossaryItems).forEach((letter) => {
    const sectionContent = glossaryItems[letter];
    const sectionSize = sectionContent.length;

    // If the flag is set, move to the next column
    if (switchColumnNext && currentColumn < 2) {
      currentColumn++;
      currentCount = 0;
      switchColumnNext = false; // Reset the flag after switching columns
    }

    // Add section to the current column
    columns[currentColumn].push({ letter, items: sectionContent });
    currentCount += sectionSize;

    // Set the flag if the target is exceeded, so the next section goes to the next column
    if (currentCount > columnTarget && currentColumn < 2) {
      switchColumnNext = true;
    }
  });

  // Search bar input handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    event.preventDefault(); // Prevent page refresh

    if (event.target.value.trim() === "") {
      setGlossaryItems(originalGlossaryItems); // Reset to all items if search is cleared
      return;
    }

    // Convert search term to lowercase for case-insensitive search
    const lowerCaseSearchTerm = event.target.value.toLowerCase();

    // Filter glossary items that contain the search term (case-insensitive)
    const filteredGlossaryItems = Object.keys(originalGlossaryItems).reduce(
      (acc, letter) => {
        const matchingItems = originalGlossaryItems[letter].filter(
          (item) => item.term.toLowerCase().includes(lowerCaseSearchTerm) // Case-insensitive match
        );

        if (matchingItems.length > 0) {
          acc[letter] = matchingItems; // Add only sections that have matches
        }

        return acc;
      },
      {}
    );

    setGlossaryItems(filteredGlossaryItems);
  };

  // Function to handle search on form submission (Enter key)
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh

    if (searchTerm.trim() === "") {
      setGlossaryItems(originalGlossaryItems); // Reset to all items if search is cleared
      return;
    }

    // Convert search term to lowercase for case-insensitive search
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    // Filter glossary items that contain the search term (case-insensitive)
    const filteredGlossaryItems = Object.keys(originalGlossaryItems).reduce(
      (acc, letter) => {
        const matchingItems = originalGlossaryItems[letter].filter(
          (item) => item.term.toLowerCase().includes(lowerCaseSearchTerm) // Case-insensitive match
        );

        if (matchingItems.length > 0) {
          acc[letter] = matchingItems; // Add only sections that have matches
        }

        return acc;
      },
      {}
    );

    setGlossaryItems(filteredGlossaryItems);
  };

  return (
    <div className="glossary-list-page">
      <div className="glossary-list-banner">
        <div>
          {/* Title */}
          <h1 className="glossary-list-title">Glossary</h1>

          {/* Introduction */}
          <p className="homepage-intro-text">
            This glossary has the medical definitions for all the material in
            this program.
          </p>
        </div>

        {/* Search bar */}
        <form className="glossary-list-search-container">
          <div className="glossary-list-search-label-container">
            <p className="glossary-list-search-label">Find a glossary term:</p>
          </div>
          <input
            type="text"
            value={searchTerm}
            placeholder="  Search..."
            aria-label="Search"
            onChange={handleSearchChange}
            className="glossary-list-search-input"
          />
        </form>
      </div>

      <div className="glossary-list-jump-section">
        <span>Sections:</span>
        <div className="glossary-list-alphabet">
          {alphabet.map((letter) => (
            <a
              href={glossaryItems[letter] ? `#${letter}` : undefined}
              key={letter}
              className={
                "glossary-list-alphabet-letter " +
                (glossaryItems[letter] ? "active" : "inactive")
              }
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      <div className="glossary-list-content">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="glossary-list-section-column">
            {column.map(({ letter, items }) => (
              <div key={letter} id={letter} className="glossary-list-section">
                <h3>{letter}</h3>
                <ul>
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className={`glossary-list-section-item ${
                        expandedItems.includes(item._id) ? "expanded" : ""
                      }`}
                    >
                      <span
                        className="glossary-list-section-item-term"
                        onClick={() => handleToggleExpand(item._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.term}
                      </span>
                      {expandedItems.includes(item._id) && (
                        <p
                          className="glossary-item-definition"
                          onClick={() => handleToggleExpand(item._id)}
                          style={{ cursor: "pointer" }}
                        >
                          {item.definition}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlossaryListPage;
