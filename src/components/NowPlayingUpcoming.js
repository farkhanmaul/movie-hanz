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
      setNowPlaying(nowPlayingData.results || nowPlayingData);
      setUpcoming(upcomingData.results || upcomingData);
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
        <div className="movie-poster-container">
          <img
            className="movie-poster"
            src={movie.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
              : '/placeholder-poster.svg'
            }
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/placeholder-poster.svg';
            }}
          />
          <div className="movie-overlay">
            <button className="play-button">▶</button>
          </div>
        </div>
        <div className="movie-info">
          <div className="movie-title">{movie.title}</div>
          <div className="movie-year">
            {new Date(movie.release_date).getFullYear()}
          </div>
          <div className="movie-rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>
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
        className="movie-card"
        onClick={() => onMovieClick && onMovieClick(movie.id)}
      >
        <div className="movie-poster-container">
          <img
            className="movie-poster"
            src={movie.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
              : '/placeholder-poster.svg'
            }
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/placeholder-poster.svg';
            }}
          />
          <div className="upcoming-badge">
            {getDaysUntilRelease(movie.release_date)}
          </div>
          <div className="movie-overlay">
            <button className="play-button">▶</button>
          </div>
        </div>
        <div className="movie-info">
          <div className="movie-title">{movie.title}</div>
          <div className="movie-year">
            {new Date(movie.release_date).getFullYear()}
          </div>
          <div className="movie-rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="section">
      <h2 className="section-title">In Theaters & Coming Soon</h2>
      
      <div className="control-tabs">
        <button
          className={activeTab === 'nowplaying' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('nowplaying')}
        >
          Now Playing ({nowPlaying.length})
        </button>
        <button
          className={activeTab === 'upcoming' ? 'tab-button active' : 'tab-button'}
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