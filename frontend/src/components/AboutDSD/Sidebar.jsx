import React from "react";

const Sidebar = () => {
  return (
    <div className="col-md-3 mt-4">
      <div className="list-group">
        <a
          href="#"
          className="list-group-item list-group-item-action active"
          aria-current="true"
        >
          About the Program
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          How to Use the Program
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          Troubleshooting
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          Acknowledgements
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
