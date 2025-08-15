import React, { useState, useEffect } from 'react';
import { getNowPlayingMovies, getUpcomingMovies } from '../api';

const NowPlayingUpcoming = ({ onMovieClick }) => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [activeTab, setActiveTab] = useState('nowplaying');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieData();
  }, []);

  const fetchMovieData = async () => {
    setLoading(true);
    try {
      const [nowPlayingData, upcomingData] = await Promise.all([
        getNowPlayingMovies(),
        getUpcomingMovies()
      ]);
      setNowPlaying(nowPlayingData);
      setUpcoming(upcomingData);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieList = (movies) => {
    return movies.slice(0, 12).map((movie) => (
      <div 
        key={movie.id} 
        className="movie-card"
        onClick={() => onMovieClick && onMovieClick(movie.id)}
      >
        <div className="movie-card-poster">
          <img
            src={movie.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          <div className="movie-card-overlay">
            <button className="view-details-btn">View Details</button>
          </div>
        </div>
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          <p className="movie-card-date">
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <div className="movie-card-rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>
          <p className="movie-card-overview">
            {movie.overview?.length > 100
              ? `${movie.overview.substring(0, 100)}...`
              : movie.overview}
          </p>
        </div>
      </div>
    ));
  };

  const getDaysUntilRelease = (releaseDate) => {
    const today = new Date();
    const release = new Date(releaseDate);
    const diffTime = release - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Released';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const renderUpcomingMovieList = (movies) => {
    return movies.slice(0, 12).map((movie) => (
      <div 
        key={movie.id} 
        className="movie-card upcoming-movie"
        onClick={() => onMovieClick && onMovieClick(movie.id)}
      >
        <div className="movie-card-poster">
          <img
            src={movie.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          <div className="upcoming-badge">
            {getDaysUntilRelease(movie.release_date)}
          </div>
          <div className="movie-card-overlay">
            <button className="view-details-btn">View Details</button>
          </div>
        </div>
        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.title}</h3>
          <p className="movie-card-date">
            Release: {new Date(movie.release_date).toLocaleDateString()}
          </p>
          <div className="movie-card-rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>
          <p className="movie-card-overview">
            {movie.overview?.length > 100
              ? `${movie.overview.substring(0, 100)}...`
              : movie.overview}
          </p>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="nowplaying-upcoming-section">
      <h2>🎬 In Theaters & Coming Soon</h2>
      
      <div className="tab-selector">
        <button
          className={activeTab === 'nowplaying' ? 'active' : ''}
          onClick={() => setActiveTab('nowplaying')}
        >
          Now Playing ({nowPlaying.length})
        </button>
        <button
          className={activeTab === 'upcoming' ? 'active' : ''}
          onClick={() => setActiveTab('upcoming')}
        >
          Coming Soon ({upcoming.length})
        </button>
      </div>

      <div className="movie-grid">
        {activeTab === 'nowplaying' && renderMovieList(nowPlaying)}
        {activeTab === 'upcoming' && renderUpcomingMovieList(upcoming)}
      </div>

      {activeTab === 'nowplaying' && nowPlaying.length === 0 && (
        <div className="no-results">
          <p>No movies currently playing.</p>
        </div>
      )}

      {activeTab === 'upcoming' && upcoming.length === 0 && (
        <div className="no-results">
          <p>No upcoming movies found.</p>
        </div>
      )}
    </div>
  );
};

export default NowPlayingUpcoming;