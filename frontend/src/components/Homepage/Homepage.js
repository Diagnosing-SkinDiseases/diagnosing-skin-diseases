import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { apiGetAllTrees } from "../../apiControllers/treeApiController";
import "../CSS/Homepage.css";
import LoadingPage from "../Loading/LoadingPage";

/**
 * Card Component
 *
 * This component renders a card for each diagnostic tree. It displays the tree's image, title, and provides
 * buttons to navigate to detailed information about the tree or to start a diagnosis.
 *
 * Props:
 *   title (String): Title of the diagnostic tree.
 *   image (String): URL of the tree's cover image.
 *   aboutLink (String): URL for the page with more information about the tree.
 *   treeId (String): Unique identifier for the diagnostic tree.
 */
const Card = ({ title, image, aboutLink, treeId }) => {
  const navigate = useNavigate();

  const AboutButton = () => {
    if (!aboutLink.includes("/treatment")) {
      return (
        <button className="homepage-button about-btn" onClick={() => navigate(`/`)}>
          About
        </button>
      );
    }

    return (
      <button
        className="homepage-button about-btn"
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

/**
 * Homepage Component
 *
 * Main landing page of the application displaying a slider of diagnostic trees. Each tree is presented
 * with its cover image and name, along with options to learn more or start a diagnosis. The trees are
 * fetched from an API and filtered to only show those that are published.
 *
 * State:
 *   trees (Array): List of diagnostic trees retrieved from the API and filtered by status.
 *
 * API:
 *   apiGetAllTrees: Fetches the list of all trees from the backend.
 *
 * Effects:
 *   useEffect initializes the fetch process on component mount and updates the `trees` state with published trees.
 */
function Homepage() {
  const [trees, setTrees] = useState([]);
  const [showArrows, setShowArrows] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    if (showArrows) {
      return <div className={className} onClick={onClick} />;
    }
    return <></>;
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    if (showArrows) {
      return <div className={className} onClick={onClick} />;
    }
    return <></>;
  };

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await apiGetAllTrees();
        const publishedTrees = response.data.filter(
          (tree) => tree.status === "PUBLISHED"
        );
        setTrees(publishedTrees);
        setShowArrows(publishedTrees.length > 8);
        setIsLoading(false);
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
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
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
        {isLoading ? (
          <LoadingPage></LoadingPage>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default Homepage;
