import "./App.css";
import { getMovieList, searchMovie, getTopMoviesThisMonth, getPopularTV, getTrendingMovies, getMovieVideos } from "./api.js";
import { useEffect, useState } from "react";
import TrendingSection from "./components/TrendingSection";
import SearchSection from "./components/SearchSection";
import MovieDetail from "./components/MovieDetail";
import NowPlayingUpcoming from "./components/NowPlayingUpcoming";
import TopRatedSection from "./components/TopRatedSection";
import GenreBrowse from "./components/GenreBrowse";
import Pagination from "./components/Pagination";
import SkeletonLoader from "./components/SkeletonLoader";
import FilteredMovies from "./components/FilteredMovies";

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [showHeroTrailer, setShowHeroTrailer] = useState(false);
  const [heroTrailerKey, setHeroTrailerKey] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilteredView, setShowFilteredView] = useState(false);
  const [filterConfig, setFilterConfig] = useState({ type: '', id: '', name: '' });

  useEffect(() => {
    if (currentSection === 'home' || currentSection === 'movies') {
      loadPopularMovies(currentPage);
    }
    if (currentSection === 'tvshows') {
      loadPopularTVShows(currentPage);
    }
  }, [currentPage, currentSection]);

  useEffect(() => {
    // Initialize data for homepage
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const [popularResult, topMonthResult, tvResult, trendingResult] = await Promise.all([
        getMovieList(1),
        getTopMoviesThisMonth(),
        getPopularTV(),
        getTrendingMovies('week') // Get trending this week for recommendations
      ]);
      
      // Show only 1 complete row per section (5 items each)
      const itemsPerRow = 5;
      setPopularMovies(popularResult.results.slice(0, itemsPerRow)); // 1 complete row only
      setPopularTVShows(tvResult.slice(0, itemsPerRow)); // 1 complete row only
      setRecommendedMovies(trendingResult.results?.slice(0, itemsPerRow) || []); // 1 complete row only
      setTotalPages(Math.min(popularResult.total_pages, 500)); // TMDb limits to 500 pages
      
      // Use top movies this month as hero carousel, fallback to popular
      if (topMonthResult && topMonthResult.length > 0) {
        setHeroMovies(topMonthResult.slice(0, 20)); // Get top 20 for carousel (more movies)
      } else if (popularResult.results && popularResult.results.length > 0) {
        setHeroMovies(popularResult.results.slice(0, 20)); // Fallback to 20 popular movies
      }
    } catch (error) {
      // Fallback if API fails
      try {
        const result = await getMovieList(1);
        const itemsPerRow = 5;
        setPopularMovies(result.results.slice(0, itemsPerRow)); // 1 complete row only
        setTotalPages(Math.min(result.total_pages, 500));
        if (result.results && result.results.length > 0) {
          setHeroMovies(result.results.slice(0, 20)); // More movies for hero carousel
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

  const loadPopularTVShows = async (page) => {
    setLoading(true);
    try {
      const result = await getPopularTV(); // Note: this API doesn't support pagination in our current implementation
      setPopularTVShows(result);
      setTotalPages(1); // For now, single page until we implement paginated TV API
    } catch (error) {
      console.error('Failed to load popular TV shows:', error);
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
    setShowMobileMenu(false); // Close mobile menu when section changes
  };

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

  const PopularTVList = () => {
    return popularTVShows.map((show, i) => {
      return (
        <div 
          className="movie-card" 
          key={i}
          onClick={() => handleMovieClick(show.id)}
        >
          <div className="movie-poster-container">
            <img
              className="Movie-img"
              alt={show.name}
              src={`${process.env.REACT_APP_BASEIMGURL}/${show.poster_path}`}
              onError={(e) => {
                e.target.src = '/placeholder-poster.jpg';
              }}
            />
            <div className="movie-overlay">
              <button className="play-button">▶</button>
            </div>
          </div>
          <div className="movie-info">
            <div className="Movie-title">{show.name}</div>
            <div className="Movie-date">{show.first_air_date}</div>
            <div className="Movie-rate">⭐ {show.vote_average?.toFixed(1)}</div>
          </div>
        </div>
      );
    });
  };

  const RecommendedMoviesList = () => {
    return recommendedMovies.map((movie, i) => {
      return (
        <div 
          className="movie-card" 
          key={i}
          onClick={() => handleMovieClick(movie.id)}
        >
          <div className="movie-poster-container">
            <div className="trending-badge">🔥 Trending</div>
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

  const toggleLightMode = () => {
    setLightMode(prev => !prev);
    document.body.classList.toggle('light-mode', !lightMode);
  };

  const handleHeroPlayTrailer = async (movieId) => {
    try {
      const videos = await getMovieVideos(movieId);
      const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        setHeroTrailerKey(trailer.key);
        setShowHeroTrailer(true);
      } else {
        // If no trailer, show movie details instead
        handleMovieClick(movieId);
      }
    } catch (error) {
      console.error('Failed to fetch trailer:', error);
      // Fallback to movie details
      handleMovieClick(movieId);
    }
  };

  const handleCloseHeroTrailer = () => {
    setShowHeroTrailer(false);
    setHeroTrailerKey(null);
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
      case 'tvshows':
        return (
          <div className="section">
            <h2 className="section-title">Popular TV Shows</h2>
            {loading ? (
              <div className="loading">Loading TV shows...</div>
            ) : (
              <div className="movie-grid">
                {popularTVShows.map((show, i) => (
                  <div 
                    className="movie-card" 
                    key={i}
                    onClick={() => handleMovieClick(show.id)}
                  >
                    <div className="movie-poster-container">
                      <img
                        className="Movie-img"
                        alt={show.name}
                        src={`${process.env.REACT_APP_BASEIMGURL}/${show.poster_path}`}
                        onError={(e) => {
                          e.target.src = '/placeholder-poster.jpg';
                        }}
                      />
                      <div className="movie-overlay">
                        <button className="play-button">▶</button>
                      </div>
                    </div>
                    <div className="movie-info">
                      <div className="Movie-title">{show.name}</div>
                      <div className="Movie-date">{show.first_air_date}</div>
                      <div className="Movie-rate">⭐ {show.vote_average?.toFixed(1)}</div>
                    </div>
                  </div>
                ))}
              </div>
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
                          onClick={() => handleHeroPlayTrailer(heroMovies[currentHeroIndex]?.id)}
                        >
                          ▶ Play Trailer
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
                <SkeletonLoader count={10} />
              ) : (
                <div className="movie-grid">
                  <PopularMovieList />
                </div>
              )}
            </div>

            {/* Popular TV Shows Section */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Popular TV Shows</h2>
                <button 
                  className="show-all-btn"
                  onClick={() => handleSectionChange('tvshows')}
                >
                  Show All
                </button>
              </div>
              {loading ? (
                <SkeletonLoader count={10} />
              ) : (
                <div className="movie-grid">
                  <PopularTVList />
                </div>
              )}
            </div>

            {/* Recommendations Section */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Recommendations for You</h2>
              </div>
              {loading ? (
                <SkeletonLoader count={10} />
              ) : (
                <div className="movie-grid">
                  <RecommendedMoviesList />
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
              </div>
            </div>
            
            {/* Mobile Navigation Menu */}
            {showMobileMenu && (
              <div className="mobile-nav-menu">
                <button 
                  className={currentSection === 'home' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => handleSectionChange('home')}
                >
                  🏠 Home
                </button>
                <button 
                  className={currentSection === 'trending' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => handleSectionChange('trending')}
                >
                  🔥 Trending
                </button>
                <button 
                  className={currentSection === 'nowplaying' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => handleSectionChange('nowplaying')}
                >
                  🎬 In Theaters
                </button>
                <button 
                  className={currentSection === 'toprated' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => handleSectionChange('toprated')}
                >
                  ⭐ Top Rated
                </button>
                <button 
                  className={currentSection === 'genres' ? 'mobile-nav-button active' : 'mobile-nav-button'}
                  onClick={() => handleSectionChange('genres')}
                >
                  🎭 Genres
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

        {/* Hero Trailer Modal */}
        {showHeroTrailer && heroTrailerKey && (
          <div className="trailer-modal-overlay" onClick={handleCloseHeroTrailer}>
            <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
              <button className="trailer-close-btn" onClick={handleCloseHeroTrailer}>×</button>
              <iframe
                src={`https://www.youtube.com/embed/${heroTrailerKey}?autoplay=1`}
                title="Movie Trailer"
                frameBorder="0"
                allowFullScreen
                allow="autoplay"
              ></iframe>
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

export default App;
