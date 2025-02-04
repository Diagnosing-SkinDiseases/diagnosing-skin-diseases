import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGetAllArticles } from "../../apiControllers/articleApiController";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import ArticleListContent from "./ArticleListContent";
import "../CSS/ArticleList.css";
import LoadingPage from "../Loading/LoadingPage";
import ErrorMessage from "../Error/ErrorMessage";
import messages from "../App/messages";
import dData from "./articleListDummyData.json";

// ArticleListPage.js
const dummyData = dData;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ArticleListPage = () => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [originalArticles, setOrginalArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGetAllArticles()
      .then((response) => {
        // Filter and transform articles to match the desired structure
        const publishedArticles = response.data.filter(
          (article) => article.status === "PUBLISHED"
        );

        // Group articles by the first letter of their title, storing both title and _id
        const groupedArticles = publishedArticles.reduce((acc, article) => {
          const firstLetter = article.title[0].toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          // Store an object with title and _id in each group
          acc[firstLetter].push({ title: article.title, _id: article._id });
          return acc;
        }, {});

        console.log("groupedArticles", groupedArticles);
        console.log("dummyData", dummyData);

        // Use dummy or fetched data
        // setArticles(dummyData);
        // setOrginalArticles(dummyData);
        setArticles(groupedArticles);
        setOrginalArticles(groupedArticles);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching articles: ", error));
  }, []);

  // Calculate total content count
  const totalContent = Object.values(articles).reduce(
    (acc, items) => acc + items.length,
    0
  );
  const columnTarget = Math.floor((totalContent / 3) * 0.8);

  const columns = [[], [], []];
  let currentColumn = 0;
  let currentCount = 0;
  let switchColumnNext = false; // Flag to indicate if we should switch columns on the next section

  // Sequentially distribute content
  Object.keys(articles).forEach((letter) => {
    const sectionContent = articles[letter];
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
  };

  // Function to handle search on form submission (Enter key)
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh

    if (searchTerm.trim() === "") {
      setArticles(originalArticles); // Reset to all articles if search is cleared
      return;
    }

    // Filter articles by search term (case-insensitive)
    const filteredArticles = Object.keys(articles).reduce((acc, letter) => {
      const matchingItems = articles[letter].filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchingItems.length > 0) {
        acc[letter] = matchingItems; // Add only sections that have matches
      }

      return acc;
    }, {});

    setArticles(filteredArticles);
  };

  return (
    <div className="article-list-page">
      <div className="article-list-banner">
        {/* Title */}
        <div>
          <h1 className="article-list-title">Articles</h1>
          {/* Introduction */}
          <p className="homepage-intro-text">
            The articles in this program describe the common skin diseases that
            you see in family practice. The articles are in alphabetical order
            and give you information to help you diagnose and treat your
            patients with skin problems.
          </p>
        </div>

        {/* Search bar */}
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchTerm}
            placeholder="  Search..."
            aria-label="Search"
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="article-list-jump-section">
        <span>Sections:</span>
        <div className="article-list-alphabet">
          {alphabet.map((letter) => (
            <a
              href={articles[letter] ? `#${letter}` : undefined}
              key={letter}
              className={
                "article-list-alphabet-letter " +
                (articles[letter] ? "active" : "inactive")
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
                  {items.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          to={`/treatment/${item.title
                            .toLowerCase()
                            .replace(/ /g, "-")}/${item._id}`}
                          className="article-list-section-item"
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleListPage;
