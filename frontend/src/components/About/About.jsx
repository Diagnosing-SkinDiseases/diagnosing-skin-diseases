import React, { useEffect, useState } from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

const About = () => {
  const [articleId, setArticleId] = useState("660e30352dc5942805a1372d");
  const location = useLocation();

  useEffect(() => {
    // Extract query parameter from URL
    const queryParams = new URLSearchParams(location.search);
    const selectedItem = queryParams.get('selectedItem');

    // Map selected item to articleId
    switch (selectedItem) {
      case "Contact":
        setArticleId("contact"); // Using "contact" to represent contact form
        break;
      case "Using This Website":
        setArticleId("660e303a2dc5942805a137c0");
        break;
      case "Acknowledgements":
        setArticleId("660e303f2dc5942805a13854");
        break;
      default:
        setArticleId("660e30352dc5942805a1372d"); // Default article ID
    }
  }, [location.search]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <h1 className="mt-4 text-center">About</h1>
        </div>
        <div className="col-md-9"></div>
      </div>
      <div className="row">
        <Sidebar setArticleId={setArticleId} selectedArticleId={articleId} />
        <MainContent articleId={articleId} />
      </div>
    </div>
  );
};

export default About;
