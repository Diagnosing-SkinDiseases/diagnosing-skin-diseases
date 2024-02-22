import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Controls from "./ListComponents/Controls";
import "./styles/AdminDashboard.css";
import "./styles/AdminEditTrees.css";

const AdminEditTrees = () => {
  return (
    <div className="admin-dashboard">
      <Controls />
      <div className="content-section">
        <div className="title-section">
          <h3>Title</h3>
          <div className="white-bar">
            <span>Lorem Epsum</span>
          </div>
        </div>
        <div className="yes-node">
          <h3>Yes Node</h3>
          <div className="white-bar">
            <span>Lorem Epsum</span>
            <button className="btn btn-primary btn-sm rounded-pill flex-right">
              Add Node
            </button>
          </div>
        </div>
        <div className="no-node">
          <h3>No Node</h3>
          <div className="white-bar">
            <span>Lorem Epsum</span>
            <button className="btn btn-danger btn-sm rounded-pill float-right">
              Add Node
            </button>
          </div>
        </div>
        <div className="button-container">
          {" "}
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
