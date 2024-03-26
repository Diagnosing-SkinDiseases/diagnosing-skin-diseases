import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Homepage.css";
import { apiGetAllTrees } from "../../apiControllers/treeApiController";

const Card = ({ title }) => {
  return (
    <div>
      <div className="card h-100 card-custom">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="btn-container">
            <button className="btn btn-primary about-btn" type="button">
              About
            </button>
            <button className="btn btn-primary enter-tree-btn" type="button">
              Start Diagnosis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Homepage() {
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await apiGetAllTrees();
        setTrees(response.data);
      } catch (error) {
        console.error("Failed to fetch trees", error);
      }
    };

    fetchTrees();
  }, []);

  // Settings for react-slick
  const settings = {
    dots: true, // Shows page indicators at the bottom of the carousel
    infinite: false, // When reaches the end, it doesn't loop back to the start
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 2, // Number of rows to display
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
        },
      },
    ],
  };

  return (
    <div className="Homepage">
      <div className="banner">Placeholder for Banner</div>
      <div className="container-fluid">
        <h2 className="homepage-text my-4">
          Primary Lesions & Diagnostic Groups
        </h2>
        <Slider {...settings}>
          {trees.map((tree, index) => (
            <Card key={index} title={tree.name} />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Homepage;
