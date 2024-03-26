import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../App/AuthContext';
import './NavBarComponent.css';

// Subtab component
const NavSubtab = ({ show, titles }) => {
  if (!show) {
    return null;
  }

  // Map through titles to create multiple subtabs if necessary
  return (
    <div className="dropdown-content">
      {titles.map((title, index) => (
        <Link key={index} to={title.path} className="subtab-item">{title.name}</Link>
      ))}
    </div>
  );
};

// Main NavBar component
const NavBarComponent = () => {
  const { isLoggedIn } = useAuth();
  const [activeLink, setActiveLink] = useState('');

  // Define links for main tabs for authenticated users
  const authLinks = [
    { name: 'Diagnosis Tree', path: '/admin/trees', subTabs: [] },
    { name: 'Articles', path: '/admin/articles', subTabs: []},
    { name: 'Glossary', path: '/admin/definitions', subTabs: [] },
    { name: 'Logout', path: '/logout', subTabs: [] }
  ];

  // Define links for main tabs for guests
  const guestLinks = [
    { name: 'Diagnosis Tree', path: '/', subTabs: [] },
    { name: 'Articles', path: '/treatment', subTabs: []},
    { name: 'Glossary', path: '/glossary', subTabs: [] },
    { name: 'About', path: '/about', subTabs: [] }
  ];

  // Use appropriate links based on authentication status
  const links = isLoggedIn ? authLinks : guestLinks;

  return (
    <div className="navbar">
      {links.map((link, index) => (
        <div key={index} className={`nav-item ${link.subTabs.length > 0 ? 'has-dropdown' : ''}`} onMouseEnter={() => setActiveLink(link.name)} onMouseLeave={() => setActiveLink('')}>
          <Link
            to={link.subTabs.length === 0 ? link.path : '#'}
            className={`nav-link ${activeLink === link.name ? 'active' : ''}`}
          >
            {link.name}
          </Link>
          {link.subTabs.length > 0 && (
            <NavSubtab show={activeLink === link.name} titles={link.subTabs} />
          )}
        </div>
      ))}
    </div>
  );
};

export default NavBarComponent;

