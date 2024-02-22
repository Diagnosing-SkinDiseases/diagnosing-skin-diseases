import React, { useEffect, useState } from "react";
import { apiGetAllArticles } from "../../../articleApiController";

const testData = ["Sample", "Sample", "Sample", "Sample"];

const renderData = (data) => {
  console.log("Test");
  return (
    <div className="sample">
      <a href="#">{data}</a>
    </div>
  );
};

const SampleWords = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      apiGetAllArticles()
        .then((response) => {
          let newData = response.data;
          console.log("Success:", newData);
          setData(
            newData.map((article) => {
              return article.title;
            })
          );
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    };

    getData();
  }, []);

  return <div className="sample-words">{data.map(renderData)}</div>;
};

export default SampleWords;
