import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { apiGetAllTrees } from "../../apiControllers/treeApiController";
import "../CSS/Homepage.css";

const Card = ({ title, image, aboutLink, treeId }) => {
  const navigate = useNavigate();

  const AboutButton = () => {
    console.log(aboutLink);
    if (!aboutLink.includes("/treatment")) {
      return (
        <button className="homepage-button" onClick={() => navigate(`/`)}>
          About
        </button>
      );
    }

    return (
      <button
        className="homepage-button"
        onClick={() =>
          navigate(`${new URL(aboutLink).pathname}?treeId=${treeId}`)
        }
      >
        About
      </button>
    );
  };

  return (
    <div className="card card-custom card-container">
      <img src={image} alt={title} className="card-img-top" />

      <div className="card-body">
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
        </div>
        <div className="card-actions">
          <AboutButton></AboutButton>
          <button
            className="homepage-button"
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
    dots: false,
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
          Diagnose by Primary Lesion & Condition
        </h2>
        <Slider {...settings}>
          {trees.map((tree, index) => (
            <Card
              key={index}
              title={tree.name}
              image={tree.coverImage}
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
