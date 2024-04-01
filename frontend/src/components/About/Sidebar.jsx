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
          About DSD
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          Using This Website
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          Acknowledgements
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          Contact
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
