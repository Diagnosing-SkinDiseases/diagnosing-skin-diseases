import React, { useEffect, useState } from "react";
import Controls from "./ListComponents/Controls";
import List from "./ListComponents/List";
import "./styles/AdminDashboard.css";
import testData from "./testData.json";
import { apiGetAllArticles } from "../../articleApiController";

const { articles } = testData;

// AdminDashboard component for managing items and filters
const TestAdminDashboard = () => {
  const [data, setData] = useState(articles);
  // State to manage filtered items
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const getData = async () => {
      apiGetAllArticles()
        .then((response) => {
          let newData = response.data;
          console.log(newData);
          newData = newData.map((article) => {
            return {
              title: article.title,
              published: article.status === "PUBLISHED",
              text: "test",
              _id: article._id,
            };
          });
          setData(newData);
          setFilteredItems(newData);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    };

    getData();
  }, []);

  // Handles the add button click
  const handleAdd = (type) => {
    console.log("Add", type);
    // Implement logic to add a tree/article/definition
  };

  // Handles the filter change
  const handleFilterChange = (newFilterValue) => {
    console.log("Changing filter to:", newFilterValue);

    const newFilteredItems = data.filter((item) => {
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
    const newFilteredItems = data.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    setFilteredItems(newFilteredItems);
  };

  return (
    <div className="admin-dashboard">
      <Controls
        onAdd={handleAdd}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <List initialItems={filteredItems} />
    </div>
  );
};

export default TestAdminDashboard;
