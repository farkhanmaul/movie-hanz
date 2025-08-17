import "./App.css";
import { useState } from "react";
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
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
    setSelectedMovieId(movieId);
    setShowMovieDetail(true);
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
      <Routes>
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
        <Route path="/cast/:id" element={<CastPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
        <Route path="/crew/:id" element={<CrewPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
        <Route path="/company/:id" element={<CompanyPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
      </Routes>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Fixed Navigation Header */}
        <nav className="header-nav">
          <div className="nav-container">
            <div className="logo-container">
              <h1>MOVIEHANZ</h1>
              <span className="logo-subtitle">Portal</span>
            </div>
            
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
                  to="/"
                  className={currentPath === '/' ? 'nav-button active' : 'nav-button'}
                >
                  Home
                </Link>
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
              </div>
            </div>
            
            {/* Mobile Navigation Menu */}
            {showMobileMenu && (
              <div className="mobile-nav-menu">
                <Link 
                  to="/"
                  className={currentPath === '/' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => setShowMobileMenu(false)}
                >
                  🏠 Home
                </Link>
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
              <div className="footer-credits">
                <p>🎬 Created with passion by <a href="https://github.com/farkhanmaul" target="_blank" rel="noopener noreferrer"><strong>Hanz</strong></a></p>
                <p>🤖 Enhanced with <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"><strong>Claude AI</strong></a></p>
                <p>🎭 Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer"><strong>The Movie Database (TMDb)</strong></a></p>
              </div>
              <div className="footer-links">
                <a href="https://github.com/farkhanmaul/movie-hanz" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
                <span>•</span>
                <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDb API</a>
                <span>•</span>
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude AI</a>
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


        {/* Movie Detail Modal */}
        {showMovieDetail && selectedMovieId && (
          <MovieDetail 
            movieId={selectedMovieId} 
            onClose={handleCloseMovieDetail}
            onMovieClick={handleMovieClick}
            onShowFilteredMovies={handleShowFilteredMovies}
          />
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
