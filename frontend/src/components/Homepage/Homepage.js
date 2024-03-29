import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./Homepage.css";
import { apiGetAllTrees } from "../../apiControllers/treeApiController";

const Card = ({ title, image, aboutLink, treeId }) => {
  const navigate = useNavigate();

  return (
    <div className="card h-100 card-custom">
      <img
        src={`data:image/jpeg;base64,${image}`}
        alt={title}
        className="card-img-top"
      />

      <div className="card-body">
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
        </div>
        <div className="card-actions">
          <a href={aboutLink} className="btn card-action-btn">
            About
          </a>
          <button
            className="btn card-action-btn"
            onClick={() => navigate(`/trees/${treeId}`)}
          >
            Start Diagnosis
          </button>
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
        // Filter the response to only include trees with a status of "PUBLISHED"
        const publishedTrees = response.data.filter(
          (tree) => tree.status === "PUBLISHED"
        );
        setTrees(publishedTrees);
      } catch (error) {
        console.error("Failed to fetch trees", error);
      }
    };

    fetchTrees();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 2,
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
    ],
  };

  return (
    <div className="Homepage">
      <div className="container-fluid">
        <h2 className="homepage-text my-4">
          Primary Lesions & Diagnostic Groups
        </h2>
        <Slider {...settings}>
          {trees.map((tree, index) => (
            <Card
              key={index}
              title={tree.name}
              image={tree.image}
              aboutLink={tree.aboutLink}
              treeId={tree._id}
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Homepage;
