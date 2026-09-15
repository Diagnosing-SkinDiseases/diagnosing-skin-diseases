import React, { useState, useEffect } from "react";
import Controls from "./ListComponents/Controls";
import List from "./ListComponents/List";
import "../CSS/Admin/AdminDashboard.css";
import ContentTypeEnum from "./enums/ContentTypeEnum";
import { apiGetAllGlossaryItems } from "../../apiControllers/glossaryItemApiController";
import {
  apiGetAllArticles,
  apiListArticles,
} from "../../apiControllers/articleApiController";
import { apiGetAllTrees } from "../../apiControllers/treeApiController";

const AdminDashboard = ({ contentType }) => {
  const [filteredItems, setFilteredItems] = useState();
  const [allItems, setAllItems] = useState([]);

  // ---- Benchmark states ----
  const [fetchDuration, setFetchDuration] = useState(null);
  const [totalLoadTime, setTotalLoadTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let apiResponse;
      let fetchStart;
      let fetchEnd;

      try {
        // Benchmark start (only for Articles)
        if (contentType === "Article") {
          fetchStart = performance.now();
        }

        switch (contentType) {
          case "Definition":
            apiResponse = await apiGetAllGlossaryItems();
            break;
          case "Article":
            apiResponse = await apiListArticles();
            break;
          case "Tree":
            apiResponse = await apiGetAllTrees();
            break;
          default:
            return;
        }

        // Benchmark end (only for Articles)
        if (contentType === "Article") {
          fetchEnd = performance.now();
          const backendTime = fetchEnd - fetchStart;
          setFetchDuration(backendTime);
        }

        if (!apiResponse || apiResponse.error) {
          console.error("API call failed");
          return;
        }

        processAndSetItems(apiResponse.data, contentType);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData().catch(console.error);
  }, [contentType]);

  // ---- Benchmark: total load time ----
  useEffect(() => {
    if (contentType !== "Article" || fetchDuration === null) return; // Only run once when fetchDuration is ready

    const [navEntry] = performance.getEntriesByType("navigation");
    const totalTime = navEntry
      ? navEntry.loadEventEnd - navEntry.startTime
      : performance.now();

    // No need to store this in state; just use a local variable to prevent re-renders
    const frontendTime = Math.round(totalTime);
    const backendTime = Math.round(fetchDuration);

    // Metrics for profiling
    const metrics = {
      page: "AdminDashboard",
      contentType: "Article",
      timestamp: new Date().toISOString(),
      totalLoadTime: frontendTime,
      backendResponseTime: backendTime,
    };
  }, [contentType, fetchDuration]);

  // ---- Data processing ----
  const processAndSetItems = (data, contentType) => {
    let processedItems = [];

    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        processedItems = data.map((definition) => ({
          title: definition.term,
          published: definition.status === "PUBLISHED",
          id: definition._id,
        }));
        break;
      case ContentTypeEnum.ARTICLE:
        processedItems = data.map((article) => ({
          title: article.title,
          published: article.status === "PUBLISHED",
          id: article._id,
        }));
        break;
      case ContentTypeEnum.TREE:
        processedItems = data.map((tree) => ({
          title: tree.name,
          published: tree.status === "PUBLISHED",
          id: tree._id,
        }));
        break;
      default:
        console.error("Unknown content type for processing");
        return;
    }

    setAllItems(processedItems);
    setFilteredItems(processedItems);
  };

  const handleFilterChange = (newFilterValue) => {
    const newFilteredItems = allItems.filter((item) => {
      if (newFilterValue === "published") return item.published;
      if (newFilterValue === "unpublished") return !item.published;
      return true;
    });
    setFilteredItems(newFilteredItems);
  };

  const handleSearch = (searchQuery) => {
    const query = searchQuery.toLowerCase();
    const newFilteredItems = allItems.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    setFilteredItems(newFilteredItems);
  };

  const renderContentHeader = () => {
    switch (contentType) {
      case ContentTypeEnum.DEFINITION:
        return "Definitions";
      case ContentTypeEnum.ARTICLE:
        return "Articles";
      case ContentTypeEnum.TREE:
        return "Trees";
      default:
        return "Content Editor";
    }
  };

  return (
    <div className="admin-dashboard">
      <Controls
        contentType={contentType}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <div className="list-title">
        <h2>{renderContentHeader()}</h2>
      </div>
      <List initialItems={filteredItems} contentType={contentType} />
    </div>
  );
};

export default AdminDashboard;
