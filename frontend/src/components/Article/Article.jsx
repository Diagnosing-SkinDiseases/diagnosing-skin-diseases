import ArticleBG from "./ArticleBG";
import "./article.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetArticle } from "../../apiControllers/articleApiController";

const Article = () => {
  const [data, setData] = useState({ content: [] });
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
    const getArticle = async () => {
      apiGetArticle(id).then((response) => {
        console.log(response.data);
        setData(response.data);
      });
    };

    getArticle();
  }, []);

  return (
    <>
      <ArticleBG data={data}></ArticleBG>
    </>
  );
};

export default Article;
