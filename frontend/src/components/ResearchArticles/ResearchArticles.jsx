import { useState } from "react";
import AlphabetButtons from "./AlphabetButtons";
import Navbar from "./NavBar";
import PlaceholderBanner from "./Placeholder";
import ResearchArticle from "./ResearchArticleHeader";
import "./ResearchArticles.css";
import SampleWords from "./SampleArticles";
import SelectedLetterDisplay from "./SelectedButton";

const ResearchArticles = () => {
  // State variable to store the selected letter
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Function to handle button click
  const handleButtonClick = (letter) => {
    setSelectedLetter(letter);
  };

  return (
    <div className="App">
      <Navbar /> {/* Render the Navbar component */}
      <PlaceholderBanner /> {/* Render the PlaceholderBanner component */}
      <ResearchArticle /> {/* Render the ResearchArticles component */}
      <AlphabetButtons onButtonClick={handleButtonClick} />{" "}
      {/* Render the AlphabetButtons component */}
      <SelectedLetterDisplay selectedLetter={selectedLetter} />{" "}
      {/* Render the SelectedLetterDisplay component */}
      <SampleWords /> {/* Render the SampleWords component */}
      {/* Other content of your single web page goes here */}
    </div>
  );
};

export default ResearchArticles;