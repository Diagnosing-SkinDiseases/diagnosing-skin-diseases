import ArticleBG from "./ArticleBG";
import "../CSS/Article.css";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  apiGetArticle,
  apiOverviewArticles,
} from "../../apiControllers/articleApiController";
import LoadingPage from "../Loading/LoadingPage";
import messages from "../App/messages";
import { renderError } from "./articleComponentController";

/**
 * Article component renders an article based on its ID or data passed through navigation state.
 * @param {string} articleId - ID of the article to fetch and display.
 * @returns {JSX.Element} - Returns the JSX element for the article.
 */
const Article = ({ articleId = "" }) => {
  // State to hold article data, overview data, and loading status
  const [data, setData] = useState({ content: [] });
  const [overviewArticles, setOverviewArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Get article ID from URL parameters
  const { id: paramId } = useParams();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    // Function to fetch article data and overview article data
    const getArticle = async (funcId) => {
      setIsLoading(true);
      setErrorMsg("");

      try {
        const [articleResponse, overviewResponse] = await Promise.all([
          apiGetArticle(funcId),
          apiOverviewArticles(),
        ]);

        setOverviewArticles(overviewResponse.data || []);

        if (articleResponse.data.status === "UNPUBLISHED") {
          setErrorMsg(
            renderError(messages.Article.articleIdNotFound, messages.email),
          );
        } else {
          setData(articleResponse.data);
        }
      } catch (error) {
        console.error("Error fetching article: ", error);
        setErrorMsg(
          renderError(messages.Article.articleIdNotFound, messages.email),
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Check if in preview mode
    const url = new URL(window.location.href);
    const isPreviewMode = url.pathname.includes("/admin/articles/preview");

    if (isPreviewMode) {
      // If in preview mode, use data from session storage
      const previewData = sessionStorage.getItem("previewData");

      if (previewData) {
        setData(JSON.parse(previewData));
      }

      // Preview mode does not need overview articles unless you want it to
      setOverviewArticles([]);
      setIsLoading(false);
    } else if (articleId) {
      // If articleId is provided, fetch article using that ID
      getArticle(articleId);
    } else if (paramId) {
      // If no articleId is provided, but paramId exists, fetch article using paramId
      getArticle(paramId);
    } else {
      // If no IDs are provided, stop loading
      setIsLoading(false);
    }
  }, [paramId, state, articleId]);

  useEffect(() => {
    if (isLoading || !window.location.hash) return;

    const targetId = decodeURIComponent(window.location.hash.slice(1));

    requestAnimationFrame(() => {
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: "auto",
          block: "start",
        });
      }
    });
  }, [isLoading, data]);

  // Render loading page while fetching data, otherwise render ArticleBG component with article data
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <ArticleBG
          data={data}
          errorMsg={errorMsg}
          overviewArticles={overviewArticles}
        />
      )}
    </>
  );
};

export default Article;
