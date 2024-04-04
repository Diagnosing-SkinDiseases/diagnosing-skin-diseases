import React, { useState, useEffect } from "react"; 
import Controls from "./ListComponents/Controls";
import List from "./ListComponents/List";
import "../CSS/Admin/AdminDashboard.css"; 
import ContentTypeEnum from './enums/ContentTypeEnum';
import { apiGetAllGlossaryItems} from "../../apiControllers/glossaryItemApiController";
import { apiGetAllArticles } from "../../apiControllers/articleApiController";
import { apiGetAllTrees } from "../../apiControllers/treeApiController";

// AdminDashboard component for managing items and filters
const AdminDashboard = ({contentType}) => {

  // State to manage filtered items
  const [filteredItems, setFilteredItems] = useState();
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let apiResponse;
      switch (contentType) {
        case "Definition":
          apiResponse = await apiGetAllGlossaryItems();
          break;
        case "Article":
          apiResponse = await apiGetAllArticles();
          break;
        case "Tree":
          apiResponse = await apiGetAllTrees();
          break;
        default:
          return;
      }

      if (!apiResponse || apiResponse.error) {
        console.error("API call failed");
        return;
      }

      // Process and update state with formatted items based on content type
      processAndSetItems(apiResponse.data, contentType);
    };

    fetchData().catch(console.error);
  }, [contentType]);

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
        console.log("Unknown content type for processing");
        return;
    }

    setAllItems(processedItems); // Keep a copy of all items for filtering
    setFilteredItems(processedItems); // Initially, display all items
  };


  // Handles the filter change
  const handleFilterChange = (newFilterValue) => {
    console.log("Changing filter to:", newFilterValue);

    const newFilteredItems = allItems.filter((item) => {
      if (newFilterValue === "published") return item.published;
      if (newFilterValue === "unpublished") return !item.published;
      return true; // Default case for "all"
    });

    console.log("Filtered items:", newFilteredItems);
    setFilteredItems(newFilteredItems);
  };

  // Handles the search
  const handleSearch = (searchQuery) => {
    console.log("Searching for", searchQuery);
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
  }

  return (
    <div className="admin-dashboard">
      <Controls
        contentType={contentType}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <div className = "list-title">
        <h2>{renderContentHeader()}</h2>
      </div>
      <List initialItems={filteredItems} 
        contentType={contentType} />
    </div>
  );
};

export default AdminDashboard;
