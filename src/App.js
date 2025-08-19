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
  const [showFilteredView, setShowFilteredView] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lightMode, setLightMode] = useState(false);
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
  
  const toggleTheme = () => {
    setLightMode(prev => !prev);
    document.body.classList.toggle('light-mode');
  };

  const handleShowFilteredMovies = (type, id, name) => {
    setFilterConfig({ type, id, name });
    setShowFilteredView(true);
  };

  const handleCloseFilteredView = () => {
    setShowFilteredView(false);
    setFilterConfig({ type: '', id: '', name: '' });
  };

  const handleMovieClick = (movieId) => navigate(`/movie/${movieId}`);

  const handleSearchClick = () => setShowSearchModal(true);

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
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            <h1>MOVIEHANZ</h1>
            <span>Portal</span>
          </Link>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search movies, TV shows, people..."
              className="search-input"
              onFocus={handleSearchClick}
              readOnly
            />
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </div>

          <div className="nav-links">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button onClick={toggleTheme} className="theme-toggle">
            {lightMode ? '🌙' : '☀️'}
          </button>

          <button 
            className={`mobile-toggle ${showMobileMenu ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`mobile-nav ${showMobileMenu ? 'show' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
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
            <div>
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
            </div>
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
  <Router basename={process.env.NODE_ENV === 'production' ? '/movie-hanz' : ''}>
    <AppContent />
  </Router>
);

export default App;