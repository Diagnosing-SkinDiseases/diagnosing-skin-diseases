import React, { useState, useEffect } from "react";
import { apiGetAllArticles } from "../../apiControllers/articleApiController";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import ArticleListContent from "./ArticleListContent";
import "../CSS/ArticleList.css";
import LoadingPage from "../Loading/LoadingPage";

/**
 * ArticleListPage Component
 *
 * Serves as the main container for the article list interface. It manages the state for articles fetched
 * from an API, as well as states for user-selected search terms and letters. This component also handles
 * the filtering logic based on user input and displays articles using child components such as SearchBar,
 * LetterFilter, and ArticleListContent.
 *
 * State:
 *   selectedLetter (String): The currently selected letter for filtering articles by their starting letter.
 *   searchTerm (String): The current search term input by the user for filtering articles.
 *   articles (Array): A list of articles retrieved from the server and filtered by their publication status.
 *
 * Effects:
 *   useEffect is used to fetch all articles from the backend via API on component mount. Only articles
 *   with a status of "PUBLISHED" are kept in the state to be displayed.
 *
 * Functionality:
 *   - handleSearch: Updates the searchTerm state and clears the selectedLetter state to ensure
 *     that filtering by search term takes precedence.
 *   - handleSelectLetter: Updates the selectedLetter state and clears the searchTerm, allowing
 *     the user to switch between filtering by letter and by search text dynamically.
 */
function ArticleListPage() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGetAllArticles()
      .then((response) => {
        // Filter articles to only include those with status "PUBLISHED"
        const publishedArticles = response.data.filter(
          (article) => article.status === "PUBLISHED"
        );
        setArticles(publishedArticles);
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching articles: ", error));
  }, []);

  function handleSearch(term) {
    setSearchTerm(term);
    setSelectedLetter("");
  }

  // Function to update selectedLetter state from Selector
  function handleSelectLetter(letter) {
    setSelectedLetter((currentLetter) =>
      currentLetter === letter ? "" : letter
    );
    setSearchTerm(""); // Clear the searchTerm when selecting a letter
  }

  return (
    <div className="ArticleList">
      <div className="content">
        <div className="article-header">
          <h1 className="article-title">Articles</h1>
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
          <ArticleListContent
            articles={articles}
            selectedLetter={selectedLetter}
            searchTerm={searchTerm}
          />
        )}
      </div>
    </div>
  );
}

export default ArticleListPage;
