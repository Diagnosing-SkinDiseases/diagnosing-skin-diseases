import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiGetAllArticles } from "../../apiControllers/articleApiController";
import SearchBar from "./SearchBar";
import LetterFilter from "./LetterFilter";
import ArticleListContent from "./ArticleListContent";
import "../CSS/ArticleList.css";
import LoadingPage from "../Loading/LoadingPage";
import ErrorMessage from "../Error/ErrorMessage";
import messages from "../App/messages";

/**
 * ArticleListPage Component
 *
 * Serves as the main container for the article list interface. It manages the state for articles fetched
 * from an API, as well as states for user-selected search terms and letters. This component also handles
 * the filtering logic based on user input and displays articles using child components such as SearchBar,
 * LetterFilter, and ArticleListContent.
 *
 * State:
 *   selectedLetter (String): The currently selected letter for filtering articles by their starting letter.
 *   searchTerm (String): The current search term input by the user for filtering articles.
 *   articles (Array): A list of articles retrieved from the server and filtered by their publication status.
 *
 * Effects:
 *   useEffect is used to fetch all articles from the backend via API on component mount. Only articles
 *   with a status of "PUBLISHED" are kept in the state to be displayed.
 *
 * Functionality:
 *   - handleSearch: Updates the searchTerm state and clears the selectedLetter state to ensure
 *     that filtering by search term takes precedence.
 *   - handleSelectLetter: Updates the selectedLetter state and clears the searchTerm, allowing
 *     the user to switch between filtering by letter and by search text dynamically.
 */
// function ArticleListPage() {
//   const [selectedLetter, setSelectedLetter] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [articles, setArticles] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

// useEffect(() => {
//   apiGetAllArticles()
//     .then((response) => {
//       // Filter articles to only include those with status "PUBLISHED"
//       const publishedArticles = response.data.filter(
//         (article) => article.status === "PUBLISHED"
//       );
//       setArticles(publishedArticles);
//       setIsLoading(false);
//     })
//     .catch((error) => console.error("Error fetching articles: ", error));
// }, []);

//   function handleSearch(term) {
//     setSearchTerm(term);
//     setSelectedLetter("");
//   }

//   // Function to update selectedLetter state from Selector
//   function handleSelectLetter(letter) {
//     setSelectedLetter((currentLetter) =>
//       currentLetter === letter ? "" : letter
//     );
//     setSearchTerm(""); // Clear the searchTerm when selecting a letter
//   }

//   return (
//     <div className="ArticleList">
//       <div className="content">
//         <div className="article-header">
//           <h1 className="article-title">Articles</h1>
//           <div className="search-bar-container">
//             <SearchBar onSearch={handleSearch} />
//           </div>
//         </div>
//         <LetterFilter
//           onSelectLetter={handleSelectLetter}
//           selectedLetter={selectedLetter}
//         />
//         {isLoading ? (
//           <LoadingPage></LoadingPage>
//         ) : articles.length === 0 ? (
//           <ErrorMessage message={messages.Article.noArticlesAvailable} />
//         ) : (
//           <ArticleListContent
//             articles={articles}
//             selectedLetter={selectedLetter}
//             searchTerm={searchTerm}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// ArticleListPage.js
const dummyData = {
  A: ["Automated Customer Service"],
  B: ["Blazops"],
  C: [
    "Call Center",
    "Chatbot Marketing",
    "Conversational AI",
    "CSAT",
    "Customer Activation",
    "Customer Acquisition Cost",
    "Customer Cohort Analysis",
    "Customer Feedback Strategy",
    "Customer Follow Up",
    "Customer Journey",
    "Customer Lifetime Value",
    "Customer Onboarding",
    "Customer Relationship Management",
    "Customer Segmentation",
    "Customer Service",
    "Customer Support",
  ],
  F: ["First Contact Resolution", "First Party Data"],
  H: ["Help Desk"],
  I: ["IVR Deflection"],
  L: ["Lead Generation", "Lifecycle Marketing"],
  M: ["Marketing Campaigns", "Marketing Funnel", "Marketing Qualified Lead"],
  N: ["NPS Score"],
  P: ["Proactive Support", "Product Adoption", "Push Notification"],
  S: ["Sales Qualified Lead"],
  T: ["Tiered Support"],
  U: ["User Onboarding"],
  W: ["Welcome Page", "Workforce Engagement Management"],
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ArticleListPage = () => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGetAllArticles()
      .then((response) => {
        // Filter and transform articles to match the desired structure
        const publishedArticles = response.data.filter(
          (article) => article.status === "PUBLISHED"
        );

        // Group articles by the first letter of their title, storing both title and _id
        const groupedArticles = publishedArticles.reduce((acc, article) => {
          const firstLetter = article.title[0].toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          // Store an object with title and _id in each group
          acc[firstLetter].push({ title: article.title, _id: article._id });
          return acc;
        }, {});

        setArticles(groupedArticles);
        setIsLoading(false);
        console.log(groupedArticles);
      })
      .catch((error) => console.error("Error fetching articles: ", error));
  }, []);

  // Calculate total content count
  const totalContent = Object.values(articles).reduce(
    (acc, items) => acc + items.length,
    0
  );
  const columnTarget = Math.floor((totalContent / 3) * 0.8);

  const columns = [[], [], []];
  let currentColumn = 0;
  let currentCount = 0;
  let switchColumnNext = false; // Flag to indicate if we should switch columns on the next section

  // Sequentially distribute content
  Object.keys(articles).forEach((letter) => {
    const sectionContent = articles[letter];
    const sectionSize = sectionContent.length;

    // If the flag is set, move to the next column
    if (switchColumnNext && currentColumn < 2) {
      currentColumn++;
      currentCount = 0;
      switchColumnNext = false; // Reset the flag after switching columns
    }

    // Add section to the current column
    columns[currentColumn].push({ letter, items: sectionContent });
    currentCount += sectionSize;

    // Set the flag if the target is exceeded, so the next section goes to the next column
    if (currentCount > columnTarget && currentColumn < 2) {
      switchColumnNext = true;
    }
  });

  return (
    <div className="article-list-page">
      <div className="jump-section">
        <span>Sections:</span>
        <div className="alphabet">
          {alphabet.map((letter) => (
            <a
              href={articles[letter] ? `#${letter}` : undefined}
              key={letter}
              className={articles[letter] ? "active" : "inactive"}
            >
              {letter}
            </a>
          ))}
        </div>
      </div>
      <div className="content">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="section-column">
            {column.map(({ letter, items }) => (
              <div key={letter} id={letter} className="section">
                <h3>{letter}</h3>
                <ul>
                  {items.map((item, index) => {
                    console.log("item:", item.title.toLowerCase());
                    return (
                      <li key={index}>
                        <Link
                          to={`/treatment/${item.title
                            .toLowerCase()
                            .replace(/ /g, "-")}/${item._id}`}
                          className="article-list-item"
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleListPage;
