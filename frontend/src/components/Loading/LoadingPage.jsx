import React from "react";
import "../CSS/Loading.css";

const LoadingPage = () => {
  return (
    <>
      <div className="loading-container">
        <h1>Loading...</h1>
        <p>Please wait as we fetch your content.</p>
      </div>
    </>
  );
};

export default LoadingPage;
