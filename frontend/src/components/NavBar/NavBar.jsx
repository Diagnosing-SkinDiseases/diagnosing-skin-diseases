import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App/AuthContext";
import DSD from "../NavBar/DSD.png";
import "../CSS/NavBarComponent.css";

// Subtab component
const NavSubtab = ({ show, titles }) => {
  const [activeSubtab, setActiveSubtab] = useState(null);

  if (!show) {
    return null;
  }

  return (
    <div
      className="dropdown-content"
      onMouseLeave={() => setActiveSubtab(null)}
    >
      {titles.map((title, index) => (
        <div
          key={index}
          className={`subtab-item ${
            title.subTabs && title.subTabs.length ? "has-nested-dropdown" : ""
          }`}
          onMouseEnter={() => setActiveSubtab(title.name)}
        >
          <Link to={title.path || "#"} className="subtab-link">
            {title.name}
          </Link>
          {title.subTabs &&
            title.subTabs.length > 0 &&
            activeSubtab === title.name && (
              <NavSubtab show={true} titles={title.subTabs} />
            )}
        </div>
      ))}
    </div>
  );
};

// Main NavBar component
const NavBarComponent = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");

  // Determine if a link is active based on the current path
  const isActiveLink = (linkPath) => location.pathname === linkPath;

  // Adjusted handle click for page reload with useNavigate
  const handleClick = (path, hasSubTabs) => {
    if (!hasSubTabs) {
      navigate(path); // Use navigate to change the path
      window.location.reload(); // Force the window to reload
    }
  };

  // Define links for main tabs for authenticated users
  const authLinks = [
    { name: "Diagnostic Trees", path: "/admin/trees", subTabs: [] },
    { name: "Articles", path: "/admin/articles", subTabs: [] },
    { name: "Glossary", path: "/admin/definitions", subTabs: [] },
    { name: "Logout", path: "/logout", subTabs: [] },
  ];

  // Define links for main tabs for guests
  const guestLinks = [
    { name: "Diagnostic Trees", path: "/", subTabs: [] },
    {
      name: "How To...",
      subTabs: [
        {
          name: "Use This Website",
          path: "/treatment/how-to-use-this-website/660e2faa2dc5942805a12f08",
        },
        {
          name: "Understand Normal Skin",
          subTabs: [
            {
              name: "Epidermis",
              path: "/treatment/epidermis/660e2fc02dc5942805a12f8c",
            },
            {
              name: "Dermis & Subcutaneous Fat",
              path: "/treatment/dermis-&-subcutaneous-fat/660e2fcc2dc5942805a13011",
            },
            {
              name: "Blood Vessels",
              path: "/treatment/blood-vessels/660e2fd42dc5942805a13097",
            },
            {
              name: "Nerves",
              path: "/treatment/nerves/660e2fdd2dc5942805a1311e",
            },
            {
              name: "Skin Appendages",
              path: "/treatment/skin-appendages/660e2fe62dc5942805a131a6",
            },
          ],
        },
        {
          name: " Diagnose Skin Disease",
          subTabs: [
            {
              name: "Taking a History",
              path: "/treatment/taking-a-history/660e2fec2dc5942805a1322f",
            },
            {
              name: "Examining the Skin",
              path: "/treatment/examining-the-skin/660e2ff32dc5942805a132b9",
            },
            {
              name: "Punch Biopsy",
              path: "/treatment/punch-biopsy/660e2ffd2dc5942805a13344",
            },
            {
              name: "Skin Scraping",
              path: "/treatment/skin-scraping/660e30042dc5942805a133d0",
            },
          ],
        },
        {
          name: "Treat Skin Disease",
          subTabs: [
            {
              name: "General Skin Care",
              path: "/treatment/general-skin-care/660e300a2dc5942805a1345d",
            },
            {
              name: "Principles of Treatment",
              path: "/treatment/principles-of-treatment/660e30102dc5942805a134eb",
            },
            {
              name: "Open Wet Dressings",
              path: "/treatment/open-wet-dressings/660e30162dc5942805a1357a",
            },
            {
              name: "Vehicles",
              path: "/treatment/vehicles/660e301d2dc5942805a1360a",
            },
            {
              name: "Topical Corticoteroids",
              path: "/treatment/topical-corticoteroids/660e30282dc5942805a1369b",
            },
          ],
        },
      ],
    },
    { name: "Articles", path: "/treatment", subTabs: [] },
    { name: "Glossary", path: "/glossary", subTabs: [] },
    { name: "About", path: "/about", subTabs: [] },
  ];

  // Use appropriate links based on authentication status
  const links = isLoggedIn ? authLinks : guestLinks;

  return (
    <div className="navbar">
      <img className="nav-logo" src={DSD} alt="DSD Logo" />
      {links.map((link, index) => (
        <div
          key={index}
          className={`nav-item ${
            link.subTabs.length > 0 ? "has-dropdown" : ""
          } ${isActiveLink(link.path) ? "active" : ""}`}
          onMouseEnter={() => setActiveLink(link.name)}
          onMouseLeave={() => setActiveLink("")}
        >
          {/* Adjust Link to div and handle clicks */}
          <div
            onClick={() => handleClick(link.path, link.subTabs.length > 0)}
            className={`nav-link ${activeLink === link.name ? "active" : ""}`}
          >
            {link.name}
          </div>
          {link.subTabs.length > 0 && (
            <NavSubtab show={activeLink === link.name} titles={link.subTabs} />
          )}
        </div>
      ))}
    </div>
  );
};

export default NavBarComponent;
