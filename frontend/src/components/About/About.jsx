import React from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import { useState } from "react";

const About = () => {
  const [articleId, setArticleId] = useState("660e30352dc5942805a1372d");
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <h1 className="mt-4 text-center" >
            About
          </h1>
        </div>
        <div className="col-md-9"></div>
      </div>
      <div className="row">
        <Sidebar setArticleId={setArticleId} />
        <MainContent articleId={articleId} />
      </div>
    </div>
  );
};

export default About;
