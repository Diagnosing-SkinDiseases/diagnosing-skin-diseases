import ArticleBG from "./ArticleBG";
import "./article.css";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { apiGetArticle } from "../../apiControllers/articleApiController";

const Article = () => {
  const [data, setData] = useState({ content: [] });
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;


  useEffect(() => {
    console.log(id);
    // If data is passed through navigate's state, use it directly
    const data = sessionStorage.getItem('previewData');
    if (data) {
      setData(JSON.parse(data));
    }
    else if (id) {
      // If no data is passed, but an ID is available, fetch the article
      const getArticle = async () => {
        apiGetArticle(id).then((response) => {
          setData(response.data);
        });
      };
      getArticle();
    }
  }, [id, state]);

  return (
    <>
      <ArticleBG data={data}></ArticleBG>
    </>
  );
};

export default Article;
