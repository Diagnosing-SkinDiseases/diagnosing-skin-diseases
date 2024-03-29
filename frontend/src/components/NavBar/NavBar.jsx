import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
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
  const [activeLink, setActiveLink] = useState('');

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
      <div className='nav-logo'>Logo</div>
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

