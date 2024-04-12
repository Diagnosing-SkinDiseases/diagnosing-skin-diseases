import ArticleBG from "./ArticleBG";
import "../CSS/Article.css";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiGetArticle } from "../../apiControllers/articleApiController";
import LoadingPage from "../Loading/LoadingPage";

/**
 * Article component renders an article based on its ID or data passed through navigation state.
 * @param {string} articleId - ID of the article to fetch and display.
 * @returns {JSX.Element} - Returns the JSX element for the article.
 */
const Article = ({ articleId = "" }) => {
  // State to hold article data and loading status
  const [data, setData] = useState({ content: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Get article ID from URL parameters
  const { id: paramId } = useParams();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    // Function to fetch article data
    const getArticle = async (funcId) => {
      apiGetArticle(funcId).then((response) => {
        setData(response.data);
        setIsLoading(false);
      });
    };

    // Check if in preview mode
    const url = new URL(window.location.href);
    const isPreviewMode = url.pathname.includes("/admin/articles/preview");

    if (isPreviewMode) {
      // If in preview mode, use data from session storage
      const previewData = sessionStorage.getItem("previewData");
      setData(JSON.parse(previewData));
      setIsLoading(false);
    } else if (articleId) {
      // If articleId is provided, fetch article using that ID
      getArticle(articleId);
    } else if (paramId) {
      // If no articleId is provided, but paramId exists, fetch article using paramId
      getArticle(paramId);
    }
  }, [paramId, state, articleId]);

  // Render loading page while fetching data, otherwise render ArticleBG component with article data
  return (
    <>{isLoading ? <LoadingPage /> : <ArticleBG data={data}></ArticleBG>}</>
  );
};

export default Article;
