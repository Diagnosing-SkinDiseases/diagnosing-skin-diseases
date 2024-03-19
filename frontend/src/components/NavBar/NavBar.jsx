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

  // Define links for main tabs and their corresponding subtabs if any
  const links = [
    { name: 'Home', path: '/', subTabs: [] },
    { name: 'Diagnosis Tree', subTabs: [{ name: 'Sub Item 1', path: '/path1' }, { name: 'Sub Item 2', path: '/path2' }] },
    { name: 'Treatment', subTabs: [{ name: 'Articles', path: '/treatment' }] },
    { name: 'Glossary', path: '/glossary', subTabs: [] },
    { name: 'About', path: '/about', subTabs: [] }
  ];

  if (isLoggedIn) {
    links.push({ name: 'Sign Out', path: '/logout', subTabs: [] });
  }

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
