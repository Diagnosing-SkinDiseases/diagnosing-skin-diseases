import ArticleBG from "./ArticleBG";
import "../CSS/Article.css";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiGetArticle } from "../../apiControllers/articleApiController";
import LoadingPage from "../Loading/LoadingPage";

const Article = ({ articleId = "" }) => {
  const [data, setData] = useState({ content: [] });
  const { id: paramId } = useParams();
  const location = useLocation();
  const { state } = location;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If data is passed through navigate's state, use it directly
    const url = new URL(window.location.href);
    const isPreviewMode = url.pathname.includes("/admin/articles/preview");

    const getArticle = async (funcId) => {
      apiGetArticle(funcId).then((response) => {
        setData(response.data);
        setIsLoading(false);
      });
    };

    if (isPreviewMode) {
      const data = sessionStorage.getItem("previewData");
      setData(JSON.parse(data));
      setIsLoading(false);
    } else if (articleId) {
      getArticle(articleId);
    } else if (paramId) {
      // If no data is passed, but an ID is available, fetch the article
      getArticle(paramId);
    }
  }, [paramId, state, articleId]);

  return (
    <>{isLoading ? <LoadingPage /> : <ArticleBG data={data}></ArticleBG>}</>
  );
};

export default Article;
