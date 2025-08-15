import React, { useState, useEffect } from 'react';
import { getTopRatedMovies, getTopRatedTV } from '../api';

const TopRatedSection = ({ onMovieClick, onTVClick }) => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopRatedData();
  }, []);

  const fetchTopRatedData = async () => {
    setLoading(true);
    try {
      const [movies, tv] = await Promise.all([
        getTopRatedMovies(),
        getTopRatedTV()
      ]);
      setTopRatedMovies(movies);
      setTopRatedTV(tv);
    } catch (error) {
      console.error('Error fetching top rated data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieList = (movies) => {
    return movies.slice(0, 12).map((movie, index) => (
      <div 
        key={movie.id} 
        className="top-rated-card"
        onClick={() => onMovieClick && onMovieClick(movie.id)}
      >
        <div className="top-rated-rank">#{index + 1}</div>
        <div className="top-rated-poster">
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
          <div className="top-rated-overlay">
            <div className="rating-badge">
              ⭐ {movie.vote_average?.toFixed(1)}
            </div>
            <button className="view-details-btn">View Details</button>
          </div>
        </div>
        <div className="top-rated-info">
          <h3 className="top-rated-title">{movie.title}</h3>
          <p className="top-rated-date">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <div className="vote-count">
            {movie.vote_count?.toLocaleString()} votes
          </div>
        </div>
      </div>
    ));
  };

  const renderTVList = (tvShows) => {
    return tvShows.slice(0, 12).map((show, index) => (
      <div 
        key={show.id} 
        className="top-rated-card"
        onClick={() => onTVClick && onTVClick(show.id)}
      >
        <div className="top-rated-rank">#{index + 1}</div>
        <div className="top-rated-poster">
          <img
            src={show.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${show.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={show.name}
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          <div className="top-rated-overlay">
            <div className="rating-badge">
              ⭐ {show.vote_average?.toFixed(1)}
            </div>
            <button className="view-details-btn">View Details</button>
          </div>
        </div>
        <div className="top-rated-info">
          <h3 className="top-rated-title">{show.name}</h3>
          <p className="top-rated-date">
            {new Date(show.first_air_date).getFullYear()}
          </p>
          <div className="vote-count">
            {show.vote_count?.toLocaleString()} votes
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="loading">Loading top rated content...</div>;
  }

  return (
    <div className="top-rated-section">
      <h2>🏆 Top Rated All Time</h2>
      
      <div className="tab-selector">
        <button
          className={activeTab === 'movies' ? 'active' : ''}
          onClick={() => setActiveTab('movies')}
        >
          Movies ({topRatedMovies.length})
        </button>
        <button
          className={activeTab === 'tv' ? 'active' : ''}
          onClick={() => setActiveTab('tv')}
        >
          TV Shows ({topRatedTV.length})
        </button>
      </div>

      <div className="top-rated-grid">
        {activeTab === 'movies' && renderMovieList(topRatedMovies)}
        {activeTab === 'tv' && renderTVList(topRatedTV)}
      </div>

      <div className="top-rated-stats">
        {activeTab === 'movies' && topRatedMovies.length > 0 && (
          <div className="stats-info">
            <p>Showing top {Math.min(12, topRatedMovies.length)} highest rated movies</p>
            <p>Minimum rating: ⭐ {Math.min(...topRatedMovies.slice(0, 12).map(m => m.vote_average)).toFixed(1)}</p>
          </div>
        )}
        {activeTab === 'tv' && topRatedTV.length > 0 && (
          <div className="stats-info">
            <p>Showing top {Math.min(12, topRatedTV.length)} highest rated TV shows</p>
            <p>Minimum rating: ⭐ {Math.min(...topRatedTV.slice(0, 12).map(s => s.vote_average)).toFixed(1)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedSection;