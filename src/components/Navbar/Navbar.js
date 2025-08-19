import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, ROUTES } from '../../constants/navigation';
import { useTheme } from '../../hooks/useTheme';
import './Navbar.css';

const Navbar = ({ onSearchClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLightMode, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="navbar__logo" onClick={closeMobileMenu}>
          <h1>MOVIEHANZ</h1>
          <span className="navbar__subtitle">Portal</span>
        </Link>
        
        {/* Search Bar */}
        <div className="navbar__search">
          <input
            type="text"
            placeholder="Search movies, TV shows, people..."
            className="navbar__search-input"
            onFocus={onSearchClick}
            readOnly
          />
          <svg className="navbar__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className={`navbar__menu-toggle ${isMobileMenuOpen ? 'navbar__menu-toggle--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Navigation Links */}
        <div className={`navbar__nav ${isMobileMenuOpen ? 'navbar__nav--mobile-open' : ''}`}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar__nav-link ${location.pathname === item.path ? 'navbar__nav-link--active' : ''}`}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <button 
            className="navbar__theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="navbar__theme-icon">
              {isLightMode ? '🌙' : '☀️'}
            </span>
            <span className="navbar__theme-text">
              {isLightMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;