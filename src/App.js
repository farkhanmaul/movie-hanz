import "./App.css";
import { useState, Suspense, lazy } from "react";
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import SearchSection from "./components/SearchSection";
import FilteredMovies from "./components/FilteredMovies";
import Footer from "./components/Footer";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const TopRatedPage = lazy(() => import("./pages/TopRatedPage"));
const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const TVShowsPage = lazy(() => import("./pages/TVShowsPage"));
const CastPage = lazy(() => import("./pages/CastPage"));
const CrewPage = lazy(() => import("./pages/CrewPage"));
const CompanyPage = lazy(() => import("./pages/CompanyPage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const AppContent = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilteredView, setShowFilteredView] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [filterConfig, setFilterConfig] = useState({ type: '', id: '', name: '' });
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/toprated', label: 'Top Rated' },
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
            <h1>MOVIEHANZ <span className="portal-text">Portal</span></h1>
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

          <div className={`nav-links ${showMobileMenu ? 'mobile-open' : ''}`}>
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
            <button onClick={toggleTheme} className="theme-toggle">
              {lightMode ? '🌙' : '☀️'}
            </button>
          </div>

          <button 
            className={`mobile-toggle ${showMobileMenu ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Suspense fallback={<div className="loading-page">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage onMovieClick={handleMovieClick} onShowFilteredMovies={handleShowFilteredMovies} onNavigate={navigate} />} />
            <Route path="/toprated" element={<TopRatedPage onMovieClick={handleMovieClick} />} />
            <Route path="/movies" element={<MoviesPage onMovieClick={handleMovieClick} />} />
            <Route path="/tvshows" element={<TVShowsPage onMovieClick={handleMovieClick} />} />
            <Route path="/movie/:id" element={<MovieDetailPage onShowFilteredMovies={handleShowFilteredMovies} />} />
            <Route path="/cast/:id" element={<CastPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
            <Route path="/crew/:id" element={<CrewPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
            <Route path="/company/:id" element={<CompanyPage onMovieClick={handleMovieClick} onClose={() => navigate('/')} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {showSearchModal && (
        <SearchSection
          onMovieClick={handleMovieClick}
          onClose={() => setShowSearchModal(false)}
          onShowFilteredMovies={handleShowFilteredMovies}
        />
      )}
      
      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;