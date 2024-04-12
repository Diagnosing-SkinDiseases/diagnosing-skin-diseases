import React from "react";
import "../CSS/Loading.css";

/**
 * LoadingPage component renders a loading indicator while content is being fetched.
 * @returns {JSX.Element} - Returns the JSX element for the loading indicator.
 */
const LoadingPage = () => {
  return (
    <>
      <div className="loading-container">
        {/* Loading indicator */}
        <h1>Loading...</h1>
        <p>Please wait as we fetch your content.</p>
      </div>
    </>
  );
};

export default LoadingPage;
