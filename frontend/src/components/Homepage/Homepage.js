// Homepage.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Homepage.css';
import NavBar from "../NavBar/NavBar";

const Card = ({ title }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 my-2">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
        </div>
      </div>
    </div>
  );
}

function Homepage() {
  const cardTitles = [
    "Acneiform Eruptions",
    "Alopecia (Hair Loss)",
    "Eczematous Rashes",
    "Place Holder",
    "Place Holder",
    "Place Holder",
    "Place Holder",
    "Place Holder"
  ];

  return (
    <div className="Homepage">
      <NavBar />
      <div className="banner">Place Holder for Banner</div>
      <div className="container-fluid">
        <h2 className="homepage-text my-4">Primary Lesions & Diagnostic Groups</h2>
        <div className="row justify-content-center">
          {cardTitles.map((title, index) => (
            <Card key={index} title={title} />
          ))}
        </div>
      </div>
      <footer className="footer">Footer</footer>
    </div>
  );
}

export default Homepage;
