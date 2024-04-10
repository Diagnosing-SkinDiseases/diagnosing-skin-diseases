import React, { useState, useEffect } from "react";
import { apiGetAllArticles } from "../../apiControllers/articleApiController";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import ArticleListContent from "./ArticleListContent";
import "../CSS/ArticleList.css";

function ArticleListPage() {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    apiGetAllArticles()
      .then((response) => {
        // Filter articles to only include those with status "PUBLISHED"
        const publishedArticles = response.data.filter(
          (article) => article.status === "PUBLISHED"
        );
        setArticles(publishedArticles);
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
