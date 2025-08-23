import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      
      // Start exit animation - longer duration for visibility
      setTimeout(() => {
        setDisplayLocation(location);
        
        // Start enter animation - longer duration
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 400);
    }
  }, [location, displayLocation]);

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="page-content">
        {children}
      </div>
      
      {/* Loading overlay during transition */}
      {isTransitioning && (
        <div className="transition-overlay">
          <div className="transition-loader">
            <div className="loader-ring"></div>
            <span className="loader-text">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTransition;