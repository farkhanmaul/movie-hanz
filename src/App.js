import "./App.css";
import { getMovieList, searchMovie, getTopRatedMovies } from "./api.js";
import { useEffect, useState } from "react";
import TrendingSection from "./components/TrendingSection";
import SearchSection from "./components/SearchSection";
import MovieDetail from "./components/MovieDetail";
import NowPlayingUpcoming from "./components/NowPlayingUpcoming";
import TopRatedSection from "./components/TopRatedSection";

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieDetail, setShowMovieDetail] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    // Fetch data for homepage
    Promise.all([
      getMovieList(),
      getTopRatedMovies()
    ]).then(([popularResult, topRatedResult]) => {
      setPopularMovies(popularResult);
      // Use top rated movie as hero
      if (topRatedResult && topRatedResult.length > 0) {
        setHeroMovie(topRatedResult[0]);
      }
    });
  }, []);

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

  const renderContent = () => {
    switch (currentSection) {
      case 'trending':
        return <TrendingSection />;
      case 'nowplaying':
        return <NowPlayingUpcoming onMovieClick={handleMovieClick} />;
      case 'toprated':
        return <TopRatedSection onMovieClick={handleMovieClick} />;
      default:
        return (
          <>
            {/* Hero Section */}
            {heroMovie && (
              <div className="hero-section">
                <div 
                  className="hero-backdrop"
                  style={{
                    backgroundImage: heroMovie.backdrop_path 
                      ? `url(https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path})`
                      : 'none'
                  }}
                >
                  <div className="hero-overlay">
                    <div className="hero-content">
                      <h1 className="hero-title">{heroMovie.title}</h1>
                      <div className="hero-meta">
                        <span className="hero-rating">⭐ {heroMovie.vote_average?.toFixed(1)}</span>
                        <span className="hero-year">{new Date(heroMovie.release_date).getFullYear()}</span>
                      </div>
                      <p className="hero-overview">
                        {heroMovie.overview?.length > 300 
                          ? `${heroMovie.overview.substring(0, 300)}...`
                          : heroMovie.overview}
                      </p>
                      <div className="hero-buttons">
                        <button 
                          className="hero-play-btn"
                          onClick={() => handleMovieClick(heroMovie.id)}
                        >
                          ▶ Play
                        </button>
                        <button 
                          className="hero-info-btn"
                          onClick={() => handleMovieClick(heroMovie.id)}
                        >
                          ⓘ More Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Popular Movies Section */}
            <div className="section">
              <h2 className="section-title">Popular Movies</h2>
              <div className="movie-grid">
                <PopularMovieList />
              </div>
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
            <h1>MOVIE</h1>
            
            <div className="app-navigation">
              <button 
                className={currentSection === 'home' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('home')}
              >
                Home
              </button>
              <button 
                className={currentSection === 'trending' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('trending')}
              >
                Trending
              </button>
              <button 
                className={currentSection === 'nowplaying' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('nowplaying')}
              >
                In Theaters
              </button>
              <button 
                className={currentSection === 'toprated' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('toprated')}
              >
                Top Rated
              </button>
              <button 
                className="search-icon-btn"
                onClick={() => setShowSearchModal(true)}
                title="Search"
              >
                🔍
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
