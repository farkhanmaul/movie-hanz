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
            className="footer-link"
          >
            Farkhan Maul
          </a>
          {' '}• Powered by{' '}
          <a 
            href="https://claude.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Claude AI
          </a>
        </p>
        <p>
          Data from{' '}
          <a 
            href="https://www.themoviedb.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
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