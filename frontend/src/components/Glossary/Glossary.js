import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGetAllGlossaryItems } from "../../apiControllers/glossaryItemApiController";
import "../CSS/Glossary.css";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import GlossaryContent from "./GlossaryContent";
import LoadingPage from "../Loading/LoadingPage";
import ErrorMessage from "../Error/ErrorMessage";
import messages from "../App/messages";

const dummyData = {
  A: [
    {
      term: "Automated Customer Service",
      definition: "Definition for Automated Customer Service",
      _id: "1",
    },
  ],
  B: [{ term: "Blazops", definition: "Definition for Blazops", _id: "2" }],
  C: [
    { term: "Call Center", definition: "Definition for Call Center", _id: "3" },
    {
      term: "Chatbot Marketing",
      definition: "Definition for Chatbot Marketing",
      _id: "4",
    },
    {
      term: "Conversational AI",
      definition: "Definition for Conversational AI",
      _id: "5",
    },
    { term: "CSAT", definition: "Definition for CSAT", _id: "6" },
    {
      term: "Customer Activation",
      definition: "Definition for Customer Activation",
      _id: "7",
    },
    {
      term: "Customer Acquisition Cost",
      definition: "Definition for Customer Acquisition Cost",
      _id: "8",
    },
    {
      term: "Customer Cohort Analysis",
      definition: "Definition for Customer Cohort Analysis",
      _id: "9",
    },
    {
      term: "Customer Feedback Strategy",
      definition: "Definition for Customer Feedback Strategy",
      _id: "10",
    },
    {
      term: "Customer Follow Up",
      definition: "Definition for Customer Follow Up",
      _id: "11",
    },
    {
      term: "Customer Journey",
      definition: "Definition for Customer Journey",
      _id: "12",
    },
    {
      term: "Customer Lifetime Value",
      definition: "Definition for Customer Lifetime Value",
      _id: "13",
    },
    {
      term: "Customer Onboarding",
      definition: "Definition for Customer Onboarding",
      _id: "14",
    },
    {
      term: "Customer Relationship Management",
      definition: "Definition for Customer Relationship Management",
      _id: "15",
    },
    {
      term: "Customer Segmentation",
      definition: "Definition for Customer Segmentation",
      _id: "16",
    },
    {
      term: "Customer Service",
      definition: "Definition for Customer Service",
      _id: "17",
    },
    {
      term: "Customer Support",
      definition: "Definition for Customer Support",
      _id: "18",
    },
  ],
  F: [
    {
      term: "First Contact Resolution",
      definition: "Definition for First Contact Resolution",
      _id: "19",
    },
    {
      term: "First Party Data",
      definition: "Definition for First Party Data",
      _id: "20",
    },
  ],
  H: [{ term: "Help Desk", definition: "Definition for Help Desk", _id: "21" }],
  I: [
    {
      term: "IVR Deflection",
      definition: "Definition for IVR Deflection",
      _id: "22",
    },
  ],
  L: [
    {
      term: "Lead Generation",
      definition: "Definition for Lead Generation",
      _id: "23",
    },
    {
      term: "Lifecycle Marketing",
      definition: "Definition for Lifecycle Marketing",
      _id: "24",
    },
  ],
  M: [
    {
      term: "Marketing Campaigns",
      definition: "Definition for Marketing Campaigns",
      _id: "25",
    },
    {
      term: "Marketing Funnel",
      definition: "Definition for Marketing Funnel",
      _id: "26",
    },
    {
      term: "Marketing Qualified Lead",
      definition: "Definition for Marketing Qualified Lead",
      _id: "27",
    },
  ],
  N: [{ term: "NPS Score", definition: "Definition for NPS Score", _id: "28" }],
  P: [
    {
      term: "Proactive Support",
      definition: "Definition for Proactive Support",
      _id: "29",
    },
    {
      term: "Product Adoption",
      definition: "Definition for Product Adoption",
      _id: "30",
    },
    {
      term: "Push Notification",
      definition: "Definition for Push Notification",
      _id: "31",
    },
  ],
  S: [
    {
      term: "Sales Qualified Lead",
      definition: "Definition for Sales Qualified Lead",
      _id: "32",
    },
  ],
  T: [
    {
      term: "Tiered Support",
      definition: "Definition for Tiered Support",
      _id: "33",
    },
  ],
  U: [
    {
      term: "User Onboarding",
      definition: "Definition for User Onboarding",
      _id: "34",
    },
  ],
  W: [
    {
      term: "Welcome Page",
      definition: "Definition for Welcome Page",
      _id: "35",
    },
    {
      term: "Workforce Engagement Management",
      definition: "Definition for Workforce Engagement Management",
      _id: "36",
    },
  ],
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const GlossaryListPage = () => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [glossaryItems, setGlossaryItems] = useState([]);
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

        setGlossaryItems(dummyData);
        // setGlossaryItems(publishedItems);
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

  return (
    <div className="article-list-page">
      <div className="article-list-banner">
        <div>
          {/* Title */}
          <h1 className="article-list-title">Glossary</h1>

          {/* Introduction */}
          <p className="homepage-intro-text">
            This glossary has the medical definitions for all the material in
            this program.
          </p>
        </div>

        {/* Search bar */}
        <form className="search-bar">
          <input
            type="text"
            value={searchTerm}
            placeholder="  Search..."
            aria-label="Search"
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="article-list-jump-section">
        <span>Sections:</span>
        <div className="article-list-alphabet">
          {alphabet.map((letter) => (
            <a
              href={glossaryItems[letter] ? `#${letter}` : undefined}
              key={letter}
              className={
                "article-list-alphabet-letter " +
                (glossaryItems[letter] ? "active" : "inactive")
              }
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      <div className="article-list-content">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="article-list-section-column">
            {column.map(({ letter, items }) => (
              <div key={letter} id={letter} className="article-list-section">
                <h3>{letter}</h3>
                <ul>
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className={
                        expandedItems.includes(item._id)
                          ? "glossary-item-expanded"
                          : "glossary-item"
                      }
                    >
                      <span
                        className=""
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
