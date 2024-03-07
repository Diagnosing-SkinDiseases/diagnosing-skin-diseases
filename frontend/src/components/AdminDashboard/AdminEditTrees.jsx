import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import RootNodeSection from "./EditorComponents/RootNodeInput";
import Controls from "./ListComponents/Controls";
import "./styles/AdminDashboard.css";
import "./styles/AdminEditTrees.css";

const AdminEditTrees = () => {
  return (
    <div className="admin-dashboard">
      <Controls />
      <div className="content-section">
        <div className="title-section">
          <div>
            {" "}
            <h3>Tree Name</h3>
            <input
              className="white-bar-input"
              type="text"
              placeholder="Enter Tree Name"
            />
          </div>
          <RootNodeSection />
        </div>
        <div className="button-container">
          <button className="btn btn-primary btn-sm rounded-pill">
            Preview
          </button>
          <button className="btn btn-primary btn-sm rounded-pill">Add</button>
          <button className="btn btn-primary btn-sm rounded-pill">
            Add & Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditTrees;
