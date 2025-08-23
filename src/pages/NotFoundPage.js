import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-header">
            <h1 className="not-found-title">404</h1>
            <div className="not-found-divider"></div>
          </div>
          
          <div className="not-found-message">
            <h2 className="not-found-subtitle">Page Not Found</h2>
            <p className="not-found-description">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="not-found-subdescription">
              The content you're trying to access might have been removed or the URL is incorrect.
            </p>
          </div>

          <div className="not-found-actions">
            <Link to="/" className="not-found-home-btn">
              🏠 Back to Home
            </Link>
            
            <div className="not-found-links">
              <Link to="/toprated" className="not-found-link">
                Top Rated
              </Link>
              <Link to="/movies" className="not-found-link">
                Movies
              </Link>
              <Link to="/tvshows" className="not-found-link">
                TV Shows
              </Link>
            </div>
          </div>

          <div className="not-found-icon">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              <path d="M8 15s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
            <p className="not-found-icon-text">Content not found</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;