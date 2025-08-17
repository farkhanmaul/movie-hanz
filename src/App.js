import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SearchSection from "./components/SearchSection";
import MovieDetail from "./components/MovieDetail";
import FilteredMovies from "./components/FilteredMovies";
import HomePage from "./pages/HomePage";
import TrendingPage from "./pages/TrendingPage";
import NowPlayingPage from "./pages/NowPlayingPage";
import TopRatedPage from "./pages/TopRatedPage";
import GenresPage from "./pages/GenresPage";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import CastPage from "./pages/CastPage";
import CrewPage from "./pages/CrewPage";
import CompanyPage from "./pages/CompanyPage";
import MovieDetailPage from "./pages/MovieDetailPage";

const AppContent = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilteredView, setShowFilteredView] = useState(false);
  const [filterConfig, setFilterConfig] = useState({ type: '', id: '', name: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const toggleMobileMenu = () => {
    setShowMobileMenu(prev => !prev);
  };

  const handleShowFilteredMovies = (type, id, name) => {
    setFilterConfig({ type, id, name });
    setShowFilteredView(true);
    setShowMovieDetail(false); // Close movie detail if open
  };

  const handleCloseFilteredView = () => {
    setShowFilteredView(false);
    setFilterConfig({ type: '', id: '', name: '' });
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleCloseMovieDetail = () => {
    setShowMovieDetail(false);
    setSelectedMovieId(null);
  };

  const toggleLightMode = () => {
    setLightMode(prev => !prev);
    document.body.classList.toggle('light-mode', !lightMode);
  };

  const renderContent = () => {
    if (showFilteredView) {
      return (
        <FilteredMovies
          filterType={filterConfig.type}
          filterId={filterConfig.id}
          filterName={filterConfig.name}
          onMovieClick={handleMovieClick}
          onClose={handleCloseFilteredView}
        />
      );
    }
    
    return (
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          timeout={300}
          classNames="page-transition"
        >
          <Routes location={location}>
            <Route path="/" element={
              <HomePage 
                onMovieClick={handleMovieClick} 
                onShowFilteredMovies={handleShowFilteredMovies}
                onNavigate={(path) => navigate(path)}
              />
            } />
            <Route path="/trending" element={<TrendingPage onMovieClick={handleMovieClick} />} />
            <Route path="/nowplaying" element={<NowPlayingPage onMovieClick={handleMovieClick} />} />
            <Route path="/toprated" element={<TopRatedPage onMovieClick={handleMovieClick} />} />
            <Route path="/genres" element={<GenresPage onMovieClick={handleMovieClick} />} />
            <Route path="/movies" element={<MoviesPage onMovieClick={handleMovieClick} />} />
            <Route path="/tvshows" element={<TVShowsPage onMovieClick={handleMovieClick} />} />
            <Route path="/movie/:id" element={<MovieDetailPage onShowFilteredMovies={handleShowFilteredMovies} />} />
            <Route path="/cast/:id" element={<CastPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
            <Route path="/crew/:id" element={<CrewPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
            <Route path="/company/:id" element={<CompanyPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Fixed Navigation Header */}
        <nav className="header-nav">
          <div className="nav-container">
            <Link to="/" className="logo-container">
              <h1>MOVIEHANZ</h1>
              <span className="logo-subtitle">Portal</span>
            </Link>
            
            <div className="nav-search-container">
              <input
                type="text"
                placeholder="Search movies, TV shows, people..."
                className="nav-search-input"
                onFocus={() => setShowSearchModal(true)}
                readOnly
              />
              <svg className="nav-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            
            <div className="nav-right">
              <button 
                className="hamburger-btn"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
              </button>
              
              <div className="app-navigation desktop-nav">
                <Link 
                  to="/trending"
                  className={currentPath === '/trending' ? 'nav-button active' : 'nav-button'}
                >
                  Trending
                </Link>
                <Link 
                  to="/nowplaying"
                  className={currentPath === '/nowplaying' ? 'nav-button active' : 'nav-button'}
                >
                  In Theaters
                </Link>
                <Link 
                  to="/toprated"
                  className={currentPath === '/toprated' ? 'nav-button active' : 'nav-button'}
                >
                  Top Rated
                </Link>
                <Link 
                  to="/genres"
                  className={currentPath === '/genres' ? 'nav-button active' : 'nav-button'}
                >
                  Genres
                </Link>
                <button 
                  className="theme-toggle-btn"
                  onClick={toggleLightMode}
                  title={lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                  {lightMode ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5"/>
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Mobile Navigation Menu */}
            {showMobileMenu && (
              <div className="mobile-nav-menu">
                <Link 
                  to="/trending"
                  className={currentPath === '/trending' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => setShowMobileMenu(false)}
                >
                  🔥 Trending
                </Link>
                <Link 
                  to="/nowplaying"
                  className={currentPath === '/nowplaying' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => setShowMobileMenu(false)}
                >
                  🎬 In Theaters
                </Link>
                <Link 
                  to="/toprated"
                  className={currentPath === '/toprated' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => setShowMobileMenu(false)}
                >
                  ⭐ Top Rated
                </Link>
                <Link 
                  to="/genres"
                  className={currentPath === '/genres' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => setShowMobileMenu(false)}
                >
                  🎭 Genres
                </Link>
                <button 
                  className="mobile-theme-toggle"
                  onClick={toggleLightMode}
                  title={lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                  {lightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Content */}
        <div className="app-content">
          {renderContent()}
          
          {/* Footer */}
          <footer className="app-footer">
            <div className="footer-content">
              <div className="footer-credits-single">
                <span>🎬 Created by <a href="https://github.com/farkhanmaul" target="_blank" rel="noopener noreferrer"><strong>Hanz</strong></a></span>
                <span>•</span>
                <span>
                  <svg className="github-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <a href="https://github.com/farkhanmaul/movie-hanz" target="_blank" rel="noopener noreferrer">GitHub</a>
                </span>
                <span>•</span>
                <span>
                  <svg className="claude-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="claude-link">Claude AI</a>
                </span>
                <span>•</span>
                <span>🎭 <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb</a></span>
              </div>
            </div>
          </footer>
        </div>

        {/* Search Modal */}
        {showSearchModal && (
          <div className="search-modal-overlay" onClick={() => setShowSearchModal(false)}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
              <button 
                className="search-modal-close"
                onClick={() => setShowSearchModal(false)}
              >
                ×
              </button>
              <SearchSection 
                onMovieClick={handleMovieClick}
                onTVClick={handleMovieClick}
                onPersonClick={(personId) => console.log('Person clicked:', personId)}
              />
            </div>
          </div>
        )}


      </header>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
