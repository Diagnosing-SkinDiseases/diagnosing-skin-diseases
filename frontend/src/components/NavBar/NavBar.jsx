import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBarComponent.css';

const NavSubtab = ({ show, title }) => {
  console.log("show: ", show)
  if (!show) {
    return null;
  }

  return (
    <div className="nav-subtab">
      <div className={`nav-subtab ${show ? 'show' : ''}`}>
        <div className="subtab-item">{title} 1</div>
        <div className="subtab-item">{title} 2</div>
        <div className="subtab-item">{title} 3</div>
        <div className="subtab-item">{title} 4</div>
        <div className="subtab-item">{title} 5</div>
      </div>
    </div>
  );
};

const NavBarComponent = () => {
  // Corrected the initial state to match the capitalization
  const [activeLink, setActiveLink] = useState('Diagnosis Tree');
  const [subTabExpanded, setSubTabExpanded] = useState(false);

  const handleSetActiveLink = (link) => {
    setActiveLink(link);
    // If we're clicking the same link, toggle the subTabExpanded state
    if (activeLink === link) {
      setSubTabExpanded(!subTabExpanded);
    } else {
      // If it's a different link, we want to ensure the subTab is shown (if it has subTabs)
      setSubTabExpanded(true);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container-fluid">
          <div className="navbar-nav w-100">
            {['Diagnosis Tree', 'Treatment', 'Research Articles', 'Glossary', 'Sign Out'].map((link, index) => (
              <a
                key={index}
                className={`nav-item nav-link ${activeLink === link ? 'active' : ''}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleSetActiveLink(link);
                  console.log("NavMenu Clicked: " + link);
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <NavSubtab show={subTabExpanded} title="Sub-tab Placeholder" />
    </div>
  );
};

export default NavBarComponent;