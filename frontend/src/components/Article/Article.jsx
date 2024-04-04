import ArticleBG from "./ArticleBG";
import "./article.css";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiGetArticle } from "../../apiControllers/articleApiController";

const Article = ({ articleId = "" }) => {
  const [data, setData] = useState({ content: [] });
  const { id: paramId } = useParams();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    // If data is passed through navigate's state, use it directly
    const url = new URL(window.location.href);
    const isPreviewMode = url.pathname.includes("/admin/articles/preview");
    if (isPreviewMode) {
      const data = sessionStorage.getItem("previewData");
      setData(JSON.parse(data));
    } else if (articleId) {
      const getArticle = async () => {
        apiGetArticle(articleId).then((response) => {
          setData(response.data);
        });
      };
      getArticle();
    } else if (paramId) {
      // If no data is passed, but an ID is available, fetch the article
      const getArticle = async () => {
        apiGetArticle(paramId).then((response) => {
          setData(response.data);
        });
      };
      getArticle();
    }
  }, [paramId, state, articleId]);

  return (
    <>
      <ArticleBG data={data}></ArticleBG>
    </>
  );
};

export default Article;
