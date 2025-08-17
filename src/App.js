import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SearchSection from "./components/SearchSection";
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
import NotFoundPage from "./pages/NotFoundPage";

const AppContent = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilteredView, setShowFilteredView] = useState(false);
  const [filterConfig, setFilterConfig] = useState({ type: '', id: '', name: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/trending', label: 'Trending' },
    { path: '/nowplaying', label: 'Now Playing' },
    { path: '/toprated', label: 'Top Rated' },
    { path: '/genres', label: 'Genres' },
    { path: '/movies', label: 'Movies' },
    { path: '/tvshows', label: 'TV Shows' }
  ];

  const toggleMobileMenu = () => setShowMobileMenu(prev => !prev);

  const handleShowFilteredMovies = (type, id, name) => {
    setFilterConfig({ type, id, name });
    setShowFilteredView(true);
  };

  const handleCloseFilteredView = () => {
    setShowFilteredView(false);
    setFilterConfig({ type: '', id: '', name: '' });
  };

  const handleMovieClick = (movieId) => navigate(`/movie/${movieId}`);

  const toggleTheme = () => {
    setLightMode(prev => !prev);
    document.body.classList.toggle('light-mode');
  };

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
    <div className="App">
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
              <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
              </button>
              
              <div className="app-navigation desktop-nav">
                {navItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={location.pathname === item.path ? 'nav-button active' : 'nav-button'}
                  >
                    {item.label}
                  </Link>
                ))}
                <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme" />
              </div>
            </div>
          </div>

          <div className={`mobile-menu ${showMobileMenu ? 'show' : ''}`}>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={location.pathname === item.path ? 'mobile-nav-button active' : 'mobile-nav-button'}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.label}
              </Link>
            ))}
            <button onClick={toggleTheme} className="mobile-theme-toggle">
              {lightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </nav>

      <main className="main-content">
        <TransitionGroup component={null}>
          <CSSTransition key={location.pathname} timeout={300} classNames="page-transition">
            <Routes location={location}>
              <Route path="/" element={<HomePage onMovieClick={handleMovieClick} onShowFilteredMovies={handleShowFilteredMovies} onNavigate={navigate} />} />
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </main>

      {showSearchModal && (
        <SearchSection
          onMovieClick={handleMovieClick}
          onClose={() => setShowSearchModal(false)}
          onShowFilteredMovies={handleShowFilteredMovies}
        />
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;