import React from 'react';
import ArticleListItem from './ArticleListItem';

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


