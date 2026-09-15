import React from "react";
import { Link } from "react-router-dom"; // Assuming react-router for navigation

/**
 * ArticleListItem Component
 *
 * Represents a single item in a list of articles. This component renders a link to the article's detailed view.
 * The URL for the link is constructed based on the article's title and its unique identifier. It transforms
 * the title into a URL-friendly format by converting spaces to dashes and making all characters lowercase.
 *
 * Props:
 *   article (Object): The article object to display. It should contain at least 'title' and '_id' properties.
 *
 * Behavior:
 *   - Constructs a URL using the article's title and ID, where the title is formatted to be URL-friendly.
 *   - Displays the article title as a clickable link that directs to the article's detail page.
 */
function ArticleListItem({ article }) {
  return (
    <li className="article-list-item">
      <Link
        to={`/articles/${article.title.toLowerCase().replace(/ /g, "-")}/${
          article._id
        }`}
      >
        {article.title}
      </Link>
    </li>
  );
}

export default ArticleListItem;
