import React, { useState } from "react"; 
import Controls from "./ListComponents/Controls";
import List from "./ListComponents/List";
import "./styles/AdminDashboard.css"; 

// AdminDashboard component for managing items and filters
const AdminDashboard = ({ data, contentType}) => {

  // State to manage filtered items
  const [filteredItems, setFilteredItems] = useState(data);

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
        contentType={contentType}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <List initialItems={filteredItems} />
    </div>
  );
};

export default AdminDashboard;
