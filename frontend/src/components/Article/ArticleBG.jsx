import ArticleContent from "./ArticleContent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * ArticleBG component renders the background layout for an article,
 * including the article content and navigation buttons.
 * @param {Object} data - The data object containing article content.
 * @returns {JSX.Element} - Returns the JSX element for the article background.
 */
const ArticleBG = ({ data, errorMsg }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hideButton = location.pathname.includes("/about");

  return (
    <>
      <div className="container pb-5 mt-5">
        <div className="row justify-content-center article-container">
          <ArticleContent data={data} errorMsg={errorMsg}></ArticleContent>
        </div>

        {/* Bottom Navigation Row */}
        <div className="row justify-content-between mt-3 px-2">
          {/* Bottom-left button */}
          {!hideButton && (
            <button
              className="article-nav-secondary"
              onClick={() => navigate("/")}
            >
              All Diagnostic Trees
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ArticleBG;
