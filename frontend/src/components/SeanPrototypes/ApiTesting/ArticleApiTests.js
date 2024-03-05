import { useState, useEffect } from "react";
import {
  apiGetAllArticles,
  apiCreateArticle,
  apiDeleteArticle,
  apiGetArticle,
  apiUpdateArticle,
} from "../../../apiControllers/articleApiController";

console.log("Rendering api tests");

const ArticleApiTests = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const executeApi = async () => {
      let test;
      let targetId = "65e79c5d850b6edc02c82bb1";

      let createPayload = {
        title: "Treatment Potato",
        content: [
          {
            type: "header1",
            content: "h1",
          },
          {
            type: "header2",
            content: "h2",
          },
          {
            type: "paragraph",
            content: "Skin",
          },
        ],
        status: "unpublished",
      };

      let updatePayload = {
        id: "65d661bdff5dcaf6084c2945",
        title: "Treatment Update A",
        content: [
          {
            type: "header1",
            content: "h1",
          },
          {
            type: "header2",
            content: "h2",
          },
          {
            type: "paragraph",
            content: "Skin",
          },
          {
            type: "png",
            content: "image",
          },
        ],
        status: "unpublished",
      };

      apiDeleteArticle(targetId)
        .then((response) => {
          test = response.data;
          console.log("SUCCESS", test);
        })
        .catch((error) => {
          console.log("ERROR", error);
          test = error;
        });
      console.log("Api request sent");
    };

    executeApi();
  }, []);

  return <>{"Article API Tests (Check console) A"}</>;
};

export default ArticleApiTests;
