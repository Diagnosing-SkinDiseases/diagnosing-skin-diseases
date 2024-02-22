import { useState } from "react";
import AlphabetButtons from "./AlphabetButtons";
import TreatmentArticle from "./TreatmentArticleHeader";
import "./Treatment.css";
import SampleWords from "./SampleArticles";
import SelectedLetterDisplay from "./SelectedButton";

const TreatmentArticles = () => {
  // State variable to store the selected letter
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Function to handle button click
  const handleButtonClick = (letter) => {
    setSelectedLetter(letter);
  };

  return (
    <div className="App">
      <TreatmentArticle /> {/* Render the TreatmentArticles component */}
      <AlphabetButtons onButtonClick={handleButtonClick} />{" "}
      {/* Render the AlphabetButtons component */}
      <SelectedLetterDisplay selectedLetter={selectedLetter} />{" "}
      {/* Render the SelectedLetterDisplay component */}
      <SampleWords /> {/* Render the SampleWords component */}
      {/* Other content of your single web page goes here */}
    </div>
  );
};

export default TreatmentArticles;
