import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App/AuthContext";
// import DSD from "../NavBar/DSD.png";
// import DSD from "../NavBar/DSD_Text_Only.png";
import DSD from "./dsd-logo-2.png";
import "../CSS/NavBarComponent.css";

/**
 * NavSubtab Component
 *
 * A reusable component for rendering nested dropdown menus within the NavBar. It shows nested subtabs when the user
 * hovers over an item that contains further nested items. It hides when there are no items to show.
 *
 * Props:
 *   show (boolean): A flag to determine whether the subtab should be displayed or not.
 *   titles (array): An array of objects describing each subtab, including the name, path, and nested subTabs.
 *
 * State:
 *   activeSubtab (string | null): Tracks the subtab that is currently active (hovered by the user).
 */
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

/**
 * NavBarComponent
 *
 * Main navigation bar component of the application. It displays different links based on the user's authentication
 * status and includes functionality for nested subtabs. It uses conditional rendering to switch between links for
 * authenticated users and guests. The component also handles navigation and active link highlighting.
 *
 * Uses:
 *   useAuth: Hook to access authentication status.
 *   useLocation: Hook to get the current URL path to highlight the active link.
 *   useNavigate: Hook for programmatically navigating to other routes.
 *
 * State:
 *   activeLink (string): Tracks which main link is currently active.
 */
const NavBarComponent = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");

  // Determine if a link is active based on the current path
  const isActiveLink = (linkPath) => {
    // For homepage and when on a diagnostic tree
    if (location.pathname.includes("/trees")) {
      if (linkPath === "/") {
        return true;
      }
    }

    if (linkPath === "/") {
      return location.pathname === linkPath;
    }

    return location.pathname.includes(linkPath) && linkPath !== "/";
  };

  // Handle link click: navigate to the path, and for non-subtab links, force a page reload
  const handleClick = (path, hasSubTabs) => {
    if (!hasSubTabs) {
      navigate(path); // Use navigate to change the path
      window.location.reload(); // Force the window to reload
    }
  };

  // Links definition for authenticated users
  const authLinks = [
    { name: "Diagnostic Trees", path: "/admin/trees", subTabs: [] },
    { name: "Articles", path: "/admin/articles", subTabs: [] },
    { name: "Glossary", path: "/admin/definitions", subTabs: [] },
    { name: "Logout", path: "/logout", subTabs: [] },
  ];

  // Links definition for guests
  const guestLinks = [
    // For homepage
    { name: "Diagnostic Trees", path: "/", subTabs: [] },
    // For when on the diagnostic tree itself
    {
      name: "How To...",
      subTabs: [
        {
          name: "Use This Website",
          path: "/how-to/how-to-use-this-website/660e2faa2dc5942805a12f08",
        },
        {
          name: "Understand Normal Skin",
          subTabs: [
            {
              name: "Epidermis",
              path: "/how-to-understand-skin/epidermis/660e2fc02dc5942805a12f8c",
            },
            {
              name: "Dermis & Subcutaneous Fat",
              path: "/how-to-understand-skin/dermis-&-subcutaneous-fat/660e2fcc2dc5942805a13011",
            },
            {
              name: "Blood Vessels",
              path: "/how-to-understand-skin/blood-vessels/660e2fd42dc5942805a13097",
            },
            {
              name: "Nerves",
              path: "/how-to-understand-skin/nerves/660e2fdd2dc5942805a1311e",
            },
            {
              name: "Skin Appendages",
              path: "/how-to-understand-skin/skin-appendages/660e2fe62dc5942805a131a6",
            },
          ],
        },
        {
          name: " Diagnose Skin Disease",
          subTabs: [
            {
              name: "Taking a History",
              path: "/how-to-diagnose/taking-a-history/660e2fec2dc5942805a1322f",
            },
            {
              name: "Examining the Skin",
              path: "/how-to-diagnose/examining-the-skin/660e2ff32dc5942805a132b9",
            },
            {
              name: "Punch Biopsy",
              path: "/how-to-diagnose/punch-biopsy/660e2ffd2dc5942805a13344",
            },
            {
              name: "Skin Scraping",
              path: "/how-to-diagnose/skin-scraping/660e30042dc5942805a133d0",
            },
          ],
        },
        {
          name: "Treat Skin Disease",
          subTabs: [
            {
              name: "General Skin Care",
              path: "/how-to-treat/general-skin-care/660e300a2dc5942805a1345d",
            },
            {
              name: "Principles of Treatment",
              path: "/how-to-treat/principles-of-treatment/660e30102dc5942805a134eb",
            },
            {
              name: "Open Wet Dressings",
              path: "/how-to-treat/open-wet-dressings/660e30162dc5942805a1357a",
            },
            {
              name: "Vehicles",
              path: "/how-to-treat/vehicles/660e301d2dc5942805a1360a",
            },
            {
              name: "Topical Corticoteroids",
              path: "/how-to-treat/topical-corticoteroids/660e30282dc5942805a1369b",
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
  const links =
    isLoggedIn && new URL(window.location).pathname.includes("/admin")
      ? authLinks
      : guestLinks;

  return (
    <div className="navbar">
      <Link className="nav-logo-container" to="/">
        <img className="nav-logo" src={DSD} alt="DSD Logo" />
      </Link>
      {links.map((link, index) => (
        <div
          key={index}
          className={`nav-item ${
            link.subTabs.length > 0 ? "has-dropdown" : ""
          } ${isActiveLink(link.path) ? "active" : ""}`}
          onMouseEnter={() => setActiveLink(link.name)}
          onMouseLeave={() => setActiveLink("")}
        >
          <div
            onClick={() => handleClick(link.path, link.subTabs.length > 0)}
            className={`d-flex align-items-center justify-content-center nav-link ${activeLink === link.name ? "active" : ""}`}
          >
            <p className="navbar-link-text">{link.name} </p>
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
