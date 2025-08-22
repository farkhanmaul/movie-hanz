import React, { useState, useEffect } from 'react';
import { getMovieList, getPopularTV, getTrendingMovies, getMovieVideos } from '../api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage = ({ onMovieClick, onShowFilteredMovies, onNavigate }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroTransitioning, setHeroTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHeroTrailer, setShowHeroTrailer] = useState(false);
  const [heroTrailerKey, setHeroTrailerKey] = useState(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  useEffect(() => {
    if (heroMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroIndex(prev => prev === heroMovies.length - 1 ? 0 : prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroMovies]);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      // Load trending movies first (for hero and recommended)
      const trendingResult = await getTrendingMovies('week');
      const itemsPerRow = 5;
      
      if (trendingResult.results) {
        setRecommendedMovies(trendingResult.results.slice(0, itemsPerRow));
        setHeroMovies(trendingResult.results.slice(0, 10)); // Reduce hero movies
        setLoading(false); // Show content early
        
        // Load other sections in background
        setTimeout(async () => {
          try {
            const [popularResult, tvResult] = await Promise.all([
              getMovieList(1),
              getPopularTV()
            ]);
            setPopularMovies(popularResult.results.slice(0, itemsPerRow));
            setPopularTVShows(tvResult.slice(0, itemsPerRow));
          } catch (error) {
            console.error('Error loading additional content:', error);
          }
        }, 100);
      }
    } catch (error) {
      // Fallback if API fails
      try {
        const result = await getMovieList(1);
        const itemsPerRow = 5;
        setPopularMovies(result.results.slice(0, itemsPerRow));
        if (result.results && result.results.length > 0) {
          setHeroMovies(result.results.slice(0, 20));
        }
      } catch (fallbackError) {
        console.error('Failed to load data:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevHero = () => {
    if (heroTransitioning) return;
    setHeroTransitioning(true);
    setTimeout(() => {
      setCurrentHeroIndex(prev => prev === 0 ? heroMovies.length - 1 : prev - 1);
      setHeroTransitioning(false);
    }, 150);
  };

  const handleNextHero = () => {
    if (heroTransitioning) return;
    setHeroTransitioning(true);
    setTimeout(() => {
      setCurrentHeroIndex(prev => prev === heroMovies.length - 1 ? 0 : prev + 1);
      setHeroTransitioning(false);
    }, 150);
  };

  const handleHeroPlayTrailer = async (movieId) => {
    try {
      const videos = await getMovieVideos(movieId);
      const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        setHeroTrailerKey(trailer.key);
        setShowHeroTrailer(true);
      } else {
        onMovieClick(movieId);
      }
    } catch (error) {
      console.error('Failed to fetch trailer:', error);
      onMovieClick(movieId);
    }
  };

  const handleCloseHeroTrailer = () => {
    setShowHeroTrailer(false);
    setHeroTrailerKey(null);
  };

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => (
      <div 
        key={movie.id} 
        className="movie-card"
        onClick={() => onMovieClick(movie.id)}
      >
        <div className="movie-poster-container">
          <img
            className="Movie-img"
            alt={movie.title}
            src={movie.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
              : '/placeholder-poster.jpg'
            }
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
    ));
  };

  const PopularTVList = () => {
    return popularTVShows.map((tv, i) => (
      <div 
        key={tv.id} 
        className="movie-card"
        onClick={() => onMovieClick(tv.id)}
      >
        <div className="movie-poster-container">
          <img
            className="Movie-img"
            alt={tv.name}
            src={tv.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${tv.poster_path}`
              : '/placeholder-poster.jpg'
            }
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          <div className="movie-overlay">
            <button className="play-button">▶</button>
          </div>
        </div>
        <div className="movie-info">
          <div className="Movie-title">{tv.name}</div>
          <div className="Movie-date">{tv.first_air_date}</div>
          <div className="Movie-rate">⭐ {tv.vote_average?.toFixed(1)}</div>
        </div>
      </div>
    ));
  };

  const RecommendedMoviesList = () => {
    return recommendedMovies.map((movie, i) => (
      <div 
        key={movie.id} 
        className="movie-card"
        onClick={() => onMovieClick(movie.id)}
      >
        <div className="movie-poster-container">
          <img
            className="Movie-img"
            alt={movie.title}
            src={movie.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
              : '/placeholder-poster.jpg'
            }
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
    ));
  };

  return (
    <>
      {/* Hero Section */}
      {heroMovies.length > 0 && (
        <div className="hero-section">
          <div 
            className={`hero-backdrop ${heroTransitioning ? 'hero-transitioning' : ''}`}
            style={{
              backgroundImage: heroMovies[currentHeroIndex]?.backdrop_path 
                ? `url(https://image.tmdb.org/t/p/original${heroMovies[currentHeroIndex].backdrop_path})`
                : 'none'
            }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="hero-title">{heroMovies[currentHeroIndex]?.title}</h1>
                <div className="hero-meta">
                  <span className="hero-year">
                    {new Date(heroMovies[currentHeroIndex]?.release_date).getFullYear()}
                  </span>
                  <span className="hero-rating">
                    {heroMovies[currentHeroIndex]?.vote_average?.toFixed(1)}
                  </span>
                </div>
                <p className="hero-description">
                  {heroMovies[currentHeroIndex]?.overview?.length > 300 
                    ? `${heroMovies[currentHeroIndex]?.overview.substring(0, 300)}...`
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
                    onClick={() => onMovieClick(heroMovies[currentHeroIndex]?.id)}
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
            
            {/* Hero Navigation */}
            <button className="hero-nav-btn hero-prev-btn" onClick={handlePrevHero}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            <button className="hero-nav-btn hero-next-btn" onClick={handleNextHero}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Popular Movies Section */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Popular Movies</h2>
          <button 
            className="show-all-btn"
            onClick={() => onNavigate('/movies')}
          >
            Show All
          </button>
        </div>
        {loading ? (
          <LoadingSpinner size="lg" className="mx-auto" />
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
            onClick={() => onNavigate('/tvshows')}
          >
            Show All
          </button>
        </div>
        {loading ? (
          <LoadingSpinner size="lg" className="mx-auto" />
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
          <LoadingSpinner size="lg" className="mx-auto" />
        ) : (
          <div className="movie-grid">
            <RecommendedMoviesList />
          </div>
        )}
      </div>

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
    </>
  );
};

export default HomePage;