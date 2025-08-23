import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Built with ❤️ by{' '}
          <a 
            href="https://github.com/farkhanmaul" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link github"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Farkhan Maul
          </a>
          {' '}• Powered by{' '}
          <a 
            href="https://claude.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link claude"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
            Claude AI
          </a>
        </p>
        <p>
          Data from{' '}
          <a 
            href="https://www.themoviedb.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link tmdb"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="footer-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            TMDb
          </a>
          {' '}• {' '}
          <a 
            href="https://github.com/farkhanmaul/movie-hanz/blob/main/LICENSE" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            MIT License
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;