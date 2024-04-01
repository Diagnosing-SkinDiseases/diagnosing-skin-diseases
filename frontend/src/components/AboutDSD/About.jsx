import React from "react";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const About = () => {
  return (
    <div className="container">
      <h2 className="mt-4" style={{ color: "#007bff" }}>
        About
      </h2>
      <div className="row">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default About;
