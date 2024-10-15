import React from "react";
import Article from "../Article/Article";
import ContactForm from "./ContactForm"; // Import your ContactForm component

const MainContent = ({ articleId }) => {
  // If the articleId is "contact", display the contact form
  if (articleId === "contact") {
    return (
      <div className="col-md-9">
        <ContactForm />
      </div>
    );
  }

  // Otherwise, display the article
  return (
    <div className="col-md-9">
      <Article articleId={articleId}></Article>
    </div>
  );
};

export default MainContent;
