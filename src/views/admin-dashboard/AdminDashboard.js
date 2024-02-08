import React, { useState } from "react"; 
import Controls from "./Controls";
import List from "./List";
import NavBar from "../NavBar";
import "./AdminDashboard.css"; 
import { faListSquares } from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [filterValue, setFilterValue] = useState("all"); 
  const items = [
    { title: "Erythematous Rashes", published: true },
    { title: "Papules", published: false },
    { title: "Lorem Ipsum", published: false },
    { title: "Lorem Ipsum", published: false },
    { title: "Lorem Ipsum", published: false },
    // ...other items
  ];
  const [filteredItems, setFilteredItems] = useState(items);

  const handleAdd = (type) => {
    console.log("Add", type);
    // Implement logic to add a tree/article/definition
  };
  const handleFilterChange = (newFilterValue) => {
    
  };

  const handleSearch = (searchQuery) => {
    console.log("Searching for", searchQuery);
    // Implement logic to perform search based on searchQuery
  };

  return (
    <div className="admin-dashboard">
      <NavBar/>
      <Controls
        onAdd={handleAdd}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />
      <List initialItems={filteredItems} />
    </div>
  );
};

export default AdminDashboard;
