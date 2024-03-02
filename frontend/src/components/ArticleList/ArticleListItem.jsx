import React from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router for navigation

function ArticleListItem({ article }) {
  return (
    <li className="article-list-item">
      <Link to={`/articles/${article._id}`}>{article.title}</Link>
    </li>
  );
}

export default ArticleListItem;
