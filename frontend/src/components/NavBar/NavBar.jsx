import React, { useState } from 'react';
import { Link, useLocation,  useNavigate } from 'react-router-dom'; 
import { useAuth } from '../App/AuthContext';
import './NavBarComponent.css';

// Subtab component
const NavSubtab = ({ show, titles }) => {
  const [activeSubtab, setActiveSubtab] = useState(null);

  if (!show) {
    return null;
  }

  return (
    <div className="dropdown-content" onMouseLeave={() => setActiveSubtab(null)}>
      {titles.map((title, index) => (
        <div 
          key={index} 
          className={`subtab-item ${title.subTabs && title.subTabs.length ? 'has-nested-dropdown' : ''}`}
          onMouseEnter={() => setActiveSubtab(title.name)}
        >
          <Link to={title.path || '#'} className="subtab-link">{title.name}</Link>
          {title.subTabs && title.subTabs.length > 0 && activeSubtab === title.name && (
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
  const [activeLink, setActiveLink] = useState('');

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
    { name: 'Diagnostic Trees', path: '/admin/trees', subTabs: [] },
    { name: 'Articles', path: '/admin/articles', subTabs: []},
    { name: 'Glossary', path: '/admin/definitions', subTabs: [] },
    { name: 'Logout', path: '/logout', subTabs: [] }
  ];

  // Define links for main tabs for guests
  const guestLinks = [
    { name: 'Diagnostic Trees', path: '/', subTabs: [] },
    {
      name: 'How To...',
      subTabs: [
        { name: 'Use this website', path: ''},
        {
          name: 'Understand Normal Skin',
          subTabs: [
            { name: 'Epidermis', path: '' },
            { name: 'Dermis & Subcutaneous Fat', path: '' },
            { name: 'Blood Vessels', path: '' },
            { name: 'Nerves', path: '' },
            { name: 'Skin Appendages', path: '' },
          ]
        },
        { name: ' Diagnose Skin Disease', subTabs: [
          { name: 'Taking a History', path: '' },
          { name: 'Examining the Skin', path: '' },
          { name: 'Punch Biopsy', path: '' },
          { name: 'Skin Scraping', path: '' },
        ] },
        { name: 'Treat Skin Disease', subTabs: [
          { name: 'General Skin Care', path: '' },
          { name: 'Principles of Treatment', path: '' },
          { name: 'Open Wet Dressings', path: '' },
          { name: 'Vehicles', path: '' },
          { name: 'Topical Corticoteroids', path: ''}
        ] },
      ]
    },
    { name: 'Articles', path: '/treatment', subTabs: []},
    { name: 'Glossary', path: '/glossary', subTabs: [] },
    { name: 'About', path: '/about', subTabs: [] }
  ];

  // Use appropriate links based on authentication status
  const links = isLoggedIn ? authLinks : guestLinks;

  return (
    <div className="navbar">
      <div className='nav-logo'> Logo </div>
      {links.map((link, index) => (
        <div 
          key={index} 
          className={`nav-item ${link.subTabs.length > 0 ? 'has-dropdown' : ''} ${isActiveLink(link.path) ? 'active' : ''}`}
          onMouseEnter={() => setActiveLink(link.name)} 
          onMouseLeave={() => setActiveLink('')}
        >
          {/* Adjust Link to div and handle clicks */}
          <div
            onClick={() => handleClick(link.path, link.subTabs.length > 0)}
            className={`nav-link ${activeLink === link.name ? 'active' : ''}`}
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

