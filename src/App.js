import "./App.css";
import { getMovieList, searchMovie, getTopMoviesThisMonth } from "./api.js";
import { useEffect, useState } from "react";
import TrendingSection from "./components/TrendingSection";
import SearchSection from "./components/SearchSection";
import MovieDetail from "./components/MovieDetail";
import NowPlayingUpcoming from "./components/NowPlayingUpcoming";
import TopRatedSection from "./components/TopRatedSection";
import GenreBrowse from "./components/GenreBrowse";
import Pagination from "./components/Pagination";

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (currentSection === 'home' || currentSection === 'movies') {
      loadPopularMovies(currentPage);
    }
  }, [currentPage, currentSection]);

  useEffect(() => {
    // Initialize data for homepage
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const [popularResult, topMonthResult] = await Promise.all([
        getMovieList(1),
        getTopMoviesThisMonth()
      ]);
      
      setPopularMovies(popularResult.results);
      setTotalPages(Math.min(popularResult.total_pages, 500)); // TMDb limits to 500 pages
      
      // Use top movies this month as hero carousel, fallback to popular
      if (topMonthResult && topMonthResult.length > 0) {
        setHeroMovies(topMonthResult.slice(0, 5)); // Get top 5 for carousel
      } else if (popularResult.results && popularResult.results.length > 0) {
        setHeroMovies(popularResult.results.slice(0, 5));
      }
    } catch (error) {
      // Fallback if API fails
      try {
        const result = await getMovieList(1);
        setPopularMovies(result.results);
        setTotalPages(Math.min(result.total_pages, 500));
        if (result.results && result.results.length > 0) {
          setHeroMovies(result.results.slice(0, 5));
        }
      } catch (fallbackError) {
        console.error('Failed to load data:', fallbackError);
      }
    }
  };

  const loadPopularMovies = async (page) => {
    setLoading(true);
    try {
      const result = await getMovieList(page);
      setPopularMovies(result.results);
      setTotalPages(Math.min(result.total_pages, 500));
    } catch (error) {
      console.error('Failed to load popular movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setCurrentPage(1); // Reset page when changing sections
  };

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => {
      return (
        <div 
          className="movie-card" 
          key={i}
          onClick={() => handleMovieClick(movie.id)}
        >
          <div className="movie-poster-container">
            <img
              className="Movie-img"
              alt={movie.title}
              src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`}
              onError={(e) => {
                e.target.src = '/placeholder-poster.jpg';
              }}
            />
            <div className="movie-overlay">
              <button className="play-button">▶</button>
            </div>
          </div>
          <div className="movie-info">
            <div className="Movie-title">{movie.title}</div>
            <div className="Movie-date">{movie.release_date}</div>
            <div className="Movie-rate">⭐ {movie.vote_average?.toFixed(1)}</div>
          </div>
        </div>
      );
    });
  };

  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q);
      setPopularMovies(query.results);
    } else if (q.length === 0) {
      const movies = await getMovieList();
      setPopularMovies(movies);
    }
  };

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
    setShowMovieDetail(true);
  };

  const handleCloseMovieDetail = () => {
    setShowMovieDetail(false);
    setSelectedMovieId(null);
  };

  const handlePrevHero = () => {
    setCurrentHeroIndex(prev => prev === 0 ? heroMovies.length - 1 : prev - 1);
  };

  const handleNextHero = () => {
    setCurrentHeroIndex(prev => prev === heroMovies.length - 1 ? 0 : prev + 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'trending':
        return <TrendingSection onMovieClick={handleMovieClick} onTVClick={handleMovieClick} />;
      case 'nowplaying':
        return <NowPlayingUpcoming onMovieClick={handleMovieClick} />;
      case 'toprated':
        return <TopRatedSection onMovieClick={handleMovieClick} onTVClick={handleMovieClick} />;
      case 'genres':
        return <GenreBrowse onMovieClick={handleMovieClick} onTVClick={handleMovieClick} />;
      case 'movies':
        return (
          <div className="section">
            <h2 className="section-title">Popular Movies</h2>
            {loading ? (
              <div className="loading">Loading movies...</div>
            ) : (
              <>
                <div className="movie-grid">
                  <PopularMovieList />
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              </>
            )}
          </div>
        );
      default:
        return (
          <>
            {/* Hero Section */}
            {heroMovies.length > 0 && (
              <div className="hero-section">
                <div 
                  className="hero-backdrop"
                  style={{
                    backgroundImage: heroMovies[currentHeroIndex]?.backdrop_path 
                      ? `url(https://image.tmdb.org/t/p/w1280${heroMovies[currentHeroIndex].backdrop_path})`
                      : 'none'
                  }}
                >
                  {/* Navigation Arrows */}
                  <button className="hero-nav-btn hero-prev-btn" onClick={handlePrevHero}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15,18 9,12 15,6"/>
                    </svg>
                  </button>
                  <button className="hero-nav-btn hero-next-btn" onClick={handleNextHero}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"/>
                    </svg>
                  </button>
                  
                  <div className="hero-overlay">
                    <div className="hero-content">
                      <h1 className="hero-title">{heroMovies[currentHeroIndex]?.title}</h1>
                      <div className="hero-meta">
                        <span className="hero-rating">⭐ {heroMovies[currentHeroIndex]?.vote_average?.toFixed(1)}</span>
                        <span className="hero-year">{new Date(heroMovies[currentHeroIndex]?.release_date).getFullYear()}</span>
                        <span className="hero-popularity">👥 {heroMovies[currentHeroIndex]?.popularity?.toFixed(0)} views</span>
                      </div>
                      <p className="hero-overview">
                        {heroMovies[currentHeroIndex]?.overview?.length > 400 
                          ? `${heroMovies[currentHeroIndex]?.overview.substring(0, 400)}...`
                          : heroMovies[currentHeroIndex]?.overview}
                      </p>
                      <div className="hero-buttons">
                        <button 
                          className="hero-play-btn"
                          onClick={() => handleMovieClick(heroMovies[currentHeroIndex]?.id)}
                        >
                          ▶ Play
                        </button>
                        <button 
                          className="hero-info-btn"
                          onClick={() => handleMovieClick(heroMovies[currentHeroIndex]?.id)}
                        >
                          ⓘ More Info
                        </button>
                      </div>
                      
                      {/* Hero Dots Indicator */}
                      <div className="hero-dots">
                        {heroMovies.map((_, index) => (
                          <button
                            key={index}
                            className={`hero-dot ${index === currentHeroIndex ? 'active' : ''}`}
                            onClick={() => setCurrentHeroIndex(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Popular Movies Section */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Popular Movies</h2>
                <button 
                  className="show-all-btn"
                  onClick={() => handleSectionChange('movies')}
                >
                  Show All
                </button>
              </div>
              {loading ? (
                <div className="loading">Loading movies...</div>
              ) : (
                <div className="movie-grid">
                  <PopularMovieList />
                </div>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Fixed Navigation Header */}
        <nav className="header-nav">
          <div className="nav-container">
            <h1>MOVIEHANZ</h1>
            
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
                <path d="21 21l-4.35-4.35"/>
              </svg>
            </div>
            
            <div className="app-navigation">
              <button 
                className={currentSection === 'home' ? 'nav-button active' : 'nav-button'}
                onClick={() => handleSectionChange('home')}
              >
                Home
              </button>
              <button 
                className={currentSection === 'trending' ? 'nav-button active' : 'nav-button'}
                onClick={() => handleSectionChange('trending')}
              >
                Trending
              </button>
              <button 
                className={currentSection === 'nowplaying' ? 'nav-button active' : 'nav-button'}
                onClick={() => handleSectionChange('nowplaying')}
              >
                In Theaters
              </button>
              <button 
                className={currentSection === 'toprated' ? 'nav-button active' : 'nav-button'}
                onClick={() => handleSectionChange('toprated')}
              >
                Top Rated
              </button>
              <button 
                className={currentSection === 'genres' ? 'nav-button active' : 'nav-button'}
                onClick={() => handleSectionChange('genres')}
              >
                Genres
              </button>
              <button 
                className="theme-toggle-btn"
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="app-content">
          {renderContent()}
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
              <SearchSection />
            </div>
          </div>
        )}

        {/* Movie Detail Modal */}
        {showMovieDetail && selectedMovieId && (
          <MovieDetail 
            movieId={selectedMovieId} 
            onClose={handleCloseMovieDetail}
          />
        )}
      </header>
    </div>
  );
};

export default App;
