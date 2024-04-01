import React, { useEffect, useState } from "react";

// Function to fetch article ID from the backend
const MainContent = () => {
  const [articleId, setArticleId] = useState(null);

  useEffect(() => {
    const fetchArticleId = async () => {
      try {
        const id = await fetchArticleIdFromBackend();
        setArticleId(id);
      } catch (error) {
        console.error("Error fetching article ID:", error);
      }
    };

    fetchArticleId();
  }, []);

  // Render content based on the fetched article ID
  return (
    <div className="col-md-9 mt-4">
      <div>
        {articleId === 1 && (
          <div>
            <h2>About the Program</h2>
            {/* Content for article with ID 1 */}
          </div>
        )}
        {articleId === 2 && (
          <div>
            <h2>Another Article</h2>
            {/* Content for article with ID 2 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
