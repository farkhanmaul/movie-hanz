import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3 className="footer-brand-title">🎬 MovieHanz</h3>
          <p className="footer-brand-subtitle">Your Ultimate Movie & TV Show Companion</p>
        </div>
        
        <div className="footer-links-section">
          <div className="footer-creator">
            <p className="footer-creator-title">Crafted with passion by</p>
            <a 
              href="https://github.com/farkhanmaul" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link creator-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Farkhan
            </a>
          </div>
          
          <div className="footer-credits">
            <div className="footer-credit-item">
              <span className="credit-label">Data Provider</span>
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link tmdb-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                  <path d="M11.25 0L8.25 7H1.5l5.375 3.9L4.375 18L11.25 12.6L18.125 18l-2.5-7.1L21 7h-6.75L11.25 0z"/>
                </svg>
                The Movie Database (TMDb)
              </a>
            </div>
            
            <div className="footer-credit-item">
              <span className="credit-label">AI Assistant</span>
              <a 
                href="https://claude.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link claude-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
                Claude AI
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-legal">
          <p className="footer-legal-text">
            © 2024 MovieHanz • Open Source under{' '}
            <a 
              href="https://github.com/farkhanmaul/movie-hanz/blob/main/LICENSE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link license-link"
            >
              MIT License
            </a>
          </p>
          <p className="footer-disclaimer">
            This product uses the TMDb API but is not endorsed or certified by TMDb
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;