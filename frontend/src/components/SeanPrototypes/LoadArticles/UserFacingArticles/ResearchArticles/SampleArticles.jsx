import React, { useEffect, useState } from "react";
import axios from "axios";
import apiUrl from "../../../../../api";

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
    let newData;

    // Make a GET request to the API endpoint
    axios
      .get(`${apiUrl}/article/read/all`)
      .then((response) => {
        // Handle the response data
        newData = response.data;

        newData = newData.map((article) => {
          return article.title;
        });

        console.log("Response:", newData);
        setData(newData);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error("Error:", error);
      });
  }, []);

  return <div className="sample-words">{data.map(renderData)}</div>;
};

export default SampleWords;
