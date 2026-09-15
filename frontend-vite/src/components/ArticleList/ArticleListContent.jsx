import React from 'react';
import ArticleListItem from './ArticleListItem';

/**
 * ArticleListContent Component
 * 
 * Handles the display of articles filtered by a selected letter or a search term. It groups
 * the filtered articles alphabetically by their starting letter and sorts them within each group.
 * This component uses the ArticleListItem to render each individual article.
 *
 * Props:
 *   articles (Array): The list of all articles fetched from an API.
 *   selectedLetter (String): The letter selected by the user for filtering the articles.
 *   searchTerm (String): The search term entered by the user to filter the articles.
 *
 * Filtering Logic:
 *   - Filters articles based on the starting letter if selectedLetter is provided.
 *   - Filters articles based on inclusion of the searchTerm in the article title if no letter is selected.
 *   - If neither is selected, all articles are displayed.
 *
 * Sorting and Grouping Logic:
 *   - Sorts articles alphabetically by their title.
 *   - Groups articles by the first letter of their title for display under categorized headers.
 */
function ArticleListContent({ articles, selectedLetter, searchTerm }) {
  let filteredArticles;

  if (selectedLetter) {
    // Filter articles by the selected letter
    filteredArticles = articles.filter(article =>
      article.title.toLowerCase().startsWith(selectedLetter.toLowerCase())
    );
  } else if (searchTerm) {
    // Filter articles by the search term
    filteredArticles = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } else {
    // No filtering, use all articles
    filteredArticles = [...articles];
  }

  // Sort articles alphabetically by title
  filteredArticles.sort((a, b) => a.title.localeCompare(b.title));

  // Group articles by their first letter
  const groupedArticles = filteredArticles.reduce((groups, article) => {
    const letter = article.title[0].toUpperCase();
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(article);
    return groups;
  }, {});

  return (
    <div>
      {Object.entries(groupedArticles).sort(([a], [b]) => a.localeCompare(b)).map(([letter, items]) => (
        <React.Fragment key={letter}>
          <div className="letter-banner">{letter}</div>
          {items.map((article, index) => (
            <ArticleListItem key={index} article={article} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ArticleListContent;


