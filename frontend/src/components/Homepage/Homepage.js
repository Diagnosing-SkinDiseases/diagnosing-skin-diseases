import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { apiGetAllTrees } from "../../apiControllers/treeApiController";
import "../CSS/Homepage.css";
import LoadingPage from "../Loading/LoadingPage";

/**
 * Card Component
 *
 * This component renders a card for each diagnostic tree. It displays the tree's image, title, a short description,
 * and a button to start a diagnosis.
 *
 * Props:
 *   title (String): Title of the diagnostic tree.
 *   image (String): URL of the tree's cover image.
 *   aboutLink (String): URL for the page with more information about the tree.
 *   treeId (String): Unique identifier for the diagnostic tree.
 */
const Card = ({ title, image, aboutLink, previewText, treeId }) => {
  const navigate = useNavigate();

  return (
    <div className="card card-custom card-container">
      <img src={image} alt={title} className="card-img-top" />
      <div className="card-body">
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">
            {previewText ||
              "This is a brief description of the diagnostic tree. It provides..."}
            <a
              className="card-link"
              href={aboutLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </p>
        </div>
        <div className="card-actions">
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
 * with its cover image and name, along with an option to start a diagnosis. The trees are
 * fetched from an API and filtered to only show those that are published.
 */
function Homepage() {
  const [trees, setTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch diagnostic trees from the API
  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await apiGetAllTrees();
        const publishedTrees = response.data.filter(
          (tree) => tree.status === "PUBLISHED"
        );
        setTrees(publishedTrees);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch trees", error);
      }
    };

    fetchTrees();
  }, []);

  // Function to adjust card title heights
  const adjustCardTitles = () => {
    const cardTitles = document.querySelectorAll(".card-title");
    let maxTitleHeight = 0;

    cardTitles.forEach((title) => {
      title.style.height = "auto";
      if (title.offsetHeight > maxTitleHeight) {
        maxTitleHeight = title.offsetHeight;
      }
    });

    cardTitles.forEach((title) => {
      title.style.height = `${maxTitleHeight}px`;
    });
  };

  // Function to adjust card preview description heights
  const adjustCardPreviews = () => {
    const cardDescriptions = document.querySelectorAll(".card-description");
    let maxDescriptionHeight = 0;

    cardDescriptions.forEach((description) => {
      description.style.height = "auto";
      if (description.offsetHeight > maxDescriptionHeight) {
        maxDescriptionHeight = description.offsetHeight;
      }
    });

    cardDescriptions.forEach((description) => {
      description.style.height = `${maxDescriptionHeight}px`;
    });
  };

  useEffect(() => {
    // Call both adjustCardTitles and adjustCardPreviews
    adjustCardTitles();
    adjustCardPreviews();

    window.addEventListener("resize", adjustCardTitles);
    window.addEventListener("resize", adjustCardPreviews);

    return () => {
      window.removeEventListener("resize", adjustCardTitles);
      window.removeEventListener("resize", adjustCardPreviews);
    };
  }, [trees]);

  // Slider settings including arrow visibility and vertical scrolling for smaller screens
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    rows: 2,
    vertical: false, // Default horizontal scrolling
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
          vertical: false, // Horizontal scrolling for medium screens
          prevArrow: <PrevArrow />,
          nextArrow: <NextArrow />,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
          vertical: false, // Horizontal scrolling for smaller screens
          prevArrow: <PrevArrow />,
          nextArrow: <NextArrow />,
        },
      },
    ],
  };

  return (
    <div className="Homepage">
      <div className="container-fluid">
        <h2 className="homepage-text my-4">Diagnose by Primary Lesion</h2>
        <p className="homepage-intro-text">
          This website is designed to help diagnose common skin diseases
          frequently seen in children and adults. Select the primary lesion that
          best matches your patient, then click Start Diagnosis for the
          diagnostic tree Q&A or click Info for an overview of that section.
        </p>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <Slider {...sliderSettings}>
            {trees.map((tree, index) => (
              <Card
                key={index}
                title={tree.name}
                image={tree.coverImage}
                aboutLink={tree.aboutLink + "?treeId=" + tree._id}
                previewText={tree.previewText}
                treeId={tree._id}
              />
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}

// Arrow components for slider navigation
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={`${className} arrow`} onClick={onClick} />;
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return <div className={`${className} arrow`} onClick={onClick} />;
};

export default Homepage;
