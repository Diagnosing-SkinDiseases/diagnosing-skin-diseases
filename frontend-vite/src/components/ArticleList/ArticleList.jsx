import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  apiOverviewArticles,
  apiListArticles,
} from "../../apiControllers/articleApiController";
import "../CSS/ArticleList.css";
import dData from "./articleListDummyData.json";
import InternalLink from "../Reusable/InternalLink";

const dummyData = dData;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ArticleListPage = () => {
  const [selectedLetter, setSelectedLetter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [originalArticles, setOriginalArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Benchmark states
  const [fetchDuration, setFetchDuration] = useState(null);
  const [totalLoadTime, setTotalLoadTime] = useState(null);

  const [overviewArticles, setOverviewArticles] = useState([]);

  const hasValidTreeLink = (article) => {
    const treeLinkBlock = article.content?.find(
      (item) => item.type === "TREELINKINPUT",
    );

    if (!treeLinkBlock?.content) return false;

    try {
      const treeLinks = JSON.parse(treeLinkBlock.content);

      return Array.isArray(treeLinks) && treeLinks.length > 0;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchStart = performance.now();

        const [articleResponse, overviewResponse] = await Promise.all([
          apiListArticles(),
          apiOverviewArticles(),
        ]);

        const fetchEnd = performance.now();
        setFetchDuration(fetchEnd - fetchStart);

        const overviewArticles = overviewResponse.data || [];

        const overviewArticleIds = new Set(
          overviewArticles.map((article) => String(article._id)),
        );

        const publishedArticles = articleResponse.data.filter(
          (article) =>
            article.status === "PUBLISHED" &&
            !overviewArticleIds.has(String(article._id)),
        );

        const groupedArticles = publishedArticles.reduce((acc, article) => {
          const firstLetter = article.title[0].toUpperCase();

          if (!acc[firstLetter]) acc[firstLetter] = [];

          acc[firstLetter].push({
            title: article.title,
            _id: article._id,
          });

          return acc;
        }, {});

        setOverviewArticles(overviewArticles);
        setArticles(groupedArticles);
        setOriginalArticles(groupedArticles);
      } catch (error) {
        console.error("Error fetching articles: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();

    fetchArticles();
  }, []);

  // ---- Benchmark: Total Load Time (component mount complete) ----
  useEffect(() => {
    if (!isLoading) {
      const [navEntry] = performance.getEntriesByType("navigation");
      const totalTime = navEntry
        ? navEntry.loadEventEnd - navEntry.startTime
        : performance.now();
      setTotalLoadTime(totalTime);

      // Metrics for profiling
      const metrics = {
        page: "ArticleListPage",
        timestamp: new Date().toISOString(),
        totalLoadTime: Math.round(totalTime),
        backendResponseTime: fetchDuration ? Math.round(fetchDuration) : null,
      };
    }
  }, [isLoading, fetchDuration]);

  // -------------------------------
  // ---- Page logic (unchanged) ----
  // -------------------------------
  const totalContent = Object.values(articles).reduce(
    (acc, items) => acc + items.length,
    0,
  );
  const columnTarget = Math.floor((totalContent / 3) * 0.8);

  const columns = [[], [], []];
  let currentColumn = 0;
  let currentCount = 0;
  let switchColumnNext = false;

  Object.keys(articles).forEach((letter) => {
    const sectionContent = articles[letter];
    const sectionSize = sectionContent.length;

    if (switchColumnNext && currentColumn < 2) {
      currentColumn++;
      currentCount = 0;
      switchColumnNext = false;
    }

    columns[currentColumn].push({ letter, items: sectionContent });
    currentCount += sectionSize;

    if (currentCount > columnTarget && currentColumn < 2) {
      switchColumnNext = true;
    }
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    event.preventDefault();

    if (event.target.value.trim() === "") {
      setArticles(originalArticles);
      return;
    }

    const filteredArticles = Object.keys(originalArticles).reduce(
      (acc, letter) => {
        const matchingItems = originalArticles[letter].filter((item) =>
          item.title.toLowerCase().includes(event.target.value.toLowerCase()),
        );
        if (matchingItems.length > 0) acc[letter] = matchingItems;
        return acc;
      },
      {},
    );

    setArticles(filteredArticles);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (searchTerm.trim() === "") {
      setArticles(originalArticles);
      return;
    }

    const filteredArticles = Object.keys(originalArticles).reduce(
      (acc, letter) => {
        const matchingItems = originalArticles[letter].filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        if (matchingItems.length > 0) acc[letter] = matchingItems;
        return acc;
      },
      {},
    );

    setArticles(filteredArticles);
  };

  return (
    <div className="article-list-page">
      <div className="article-list-banner article-list-overview-banner">
        <div className="article-overview-banner-content">
          <h1 className="article-list-title">Overview Articles</h1>
          <p className="article-list-intro-text">
            Generally illustrative in determining which diagnostic tree to
            utilize.
          </p>
        </div>
      </div>

      <div className="article-list-content article-list-overview-mod">
        {overviewArticles.map((article) => (
          <InternalLink
            key={article._id}
            to={article.url}
            className="article-list-section-item"
          >
            {article.title}
          </InternalLink>
        ))}
      </div>

      <div className="article-list-banner">
        <div>
          <h1 className="article-list-title">
            Diagnostic and Treatment Articles
          </h1>
          <p className="article-list-intro-text">
            The articles in this program describe the common skin diseases that
            you see in family practice. The articles are in alphabetical order
            and give you information to help you diagnose and treat your
            patients with skin problems.
          </p>
        </div>

        <form
          className="article-list-search-container"
          onSubmit={handleSearchSubmit}
        >
          <div className="article-list-search-label-container">
            <p className="article-list-search-label"> Find an article: </p>
          </div>
          <input
            type="text"
            value={searchTerm}
            placeholder="  Search..."
            aria-label="Search"
            onChange={handleSearchChange}
            className="article-list-search-input"
          />
        </form>
      </div>

      <div className="article-list-jump-section">
        <span>Sections:</span>
        <div className="article-list-alphabet">
          {alphabet.map((letter) => (
            <a
              href={articles[letter] ? `#${letter}` : undefined}
              key={letter}
              className={
                "article-list-alphabet-letter " +
                (articles[letter] ? "active" : "inactive")
              }
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      <div className="article-list-content">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="article-list-section-column">
            {column.map(({ letter, items }) => (
              <div key={letter} id={letter} className="article-list-section">
                <h3>{letter}</h3>
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>
                      <InternalLink
                        to={`/articles/${item.title
                          .toLowerCase()
                          .replace(/ /g, "-")}/${item._id}`}
                        className="article-list-section-item"
                      >
                        {item.title}
                      </InternalLink>
                    </li>
                  ))}
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
