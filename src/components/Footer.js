import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Movie Hanz</h3>
          <p>Discover trending movies, TV shows, and entertainment content.</p>
        </div>
        
        <div className="footer-section">
          <h4>Developer</h4>
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
          </p>
          <p>
            Powered by{' '}
            <a 
              href="https://claude.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              Claude AI
            </a>
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Data Source</h4>
          <p>
            Movie data provided by{' '}
            <a 
              href="https://www.themoviedb.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              The Movie Database (TMDb)
            </a>
          </p>
        </div>
        
        <div className="footer-section">
          <h4>License</h4>
          <p>
            <a 
              href="https://github.com/farkhanmaul/movie-hanz/blob/main/LICENSE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              MIT License
            </a>
          </p>
          <p>© 2025 Movie Hanz. All rights reserved.</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>
          Made with{' '}
          <span className="footer-heart">❤️</span>
          {' '}using React • Deployed on GitHub Pages
        </p>
      </div>
    </footer>
  );
};

export default Footer;