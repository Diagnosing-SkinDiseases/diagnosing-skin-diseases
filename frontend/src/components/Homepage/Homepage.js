// Homepage.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Homepage.css";

const Card = ({ title }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 my-2">
      <div className="card h-100 card-custom">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="btn-container">
            <button className="btn btn-primary about-btn" type="button" href="#">About</button>
            <button className="btn btn-primary enter-tree-btn" type="button" href="#">Start Diagnosis</button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Homepage() {
  const cardTitles = [
    "Acneiform Eruptions",
    "Alopecia (Hair Loss)",
    "Eczematous Rashes",
    "Place Holder",
    "Place Holder",
    "Place Holder",
    "Place Holder",
    "Place Holder",
  ];

  return (
    <div className="Homepage">
      <div className="banner">Place Holder for Banner</div>
      <div className="container-fluid">
        <h2 className="homepage-text my-4">
          Primary Lesions & Diagnostic Groups
        </h2>
        <div className="row justify-content-center">
          {cardTitles.map((title, index) => (
            <Card key={index} title={title} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
