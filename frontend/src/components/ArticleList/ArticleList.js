import React, { useState, useEffect } from "react";
import { apiGetAllArticles } from "../../apiControllers/articleApiController"; // Assuming you have this file set up similar to glossaryItemApiController
import "./ArticleList.css"; // Assume similar styling to Glossary.css
import SearchBar from "./SearchBar"; // Reuse the same component
import LetterFilter from "./LetterFilter"; // Reuse the same component
import ArticleListContent from "./ArticleListContent"; // New component, similar to GlossaryContent

function ArticleListPage() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    apiGetAllArticles()
      .then((response) => {
        setArticles(response.data);
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
      <div className="banner"></div>
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
        <ArticleListContent
          articles={articles}
          selectedLetter={selectedLetter}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

export default ArticleListPage;