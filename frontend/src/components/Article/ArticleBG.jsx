import ArticleContent from "./ArticleContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * ArticleBG component renders the background layout for an article,
 * including the article content and navigation buttons.
 *
 * @param {Object} data - The data object containing article content.
 * @param {string} errorMsg - Error message to display.
 * @param {Array} overviewArticles - Overview article navigation data.
 * @returns {JSX.Element}
 */
const ArticleBG = ({ data, errorMsg, overviewArticles }) => {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const hideButton = routerLocation.pathname.includes("/about");

  const previousUrl = routerLocation.state?.internalPrevious;
  const showPreviousButton = Boolean(previousUrl);

  return (
    <div className="container pb-5 mt-5">
      <div className="row justify-content-center article-container">
        <ArticleContent
          data={data}
          errorMsg={errorMsg}
          overviewArticles={overviewArticles}
        />
      </div>

      {/* Bottom Navigation Row */}
      <div className="row justify-content-between mt-3 px-2">
        <div className="article-bottom-nav-left">
          {showPreviousButton && (
            <button
              type="button"
              className="article-nav-secondary article-previous-button"
              onClick={() => navigate(previousUrl)}
            >
              Previous
            </button>
          )}

          {!hideButton && (
            <button
              type="button"
              className="article-nav-secondary"
              onClick={() => navigate("/")}
            >
              All Diagnostic Trees
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleBG;
