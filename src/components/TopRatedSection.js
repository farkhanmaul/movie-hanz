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
        className="movie-card"
        onClick={() => onMovieClick && onMovieClick(movie.id)}
      >
        <div className="movie-poster-container">
          <div className="top-rated-rank">#{index + 1}</div>
          <img
            className="movie-poster"
            src={movie.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={movie.title}
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
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

  const renderTVList = (tvShows) => {
    return tvShows.slice(0, 12).map((show, index) => (
      <div 
        key={show.id} 
        className="movie-card"
        onClick={() => onTVClick && onTVClick(show.id)}
      >
        <div className="movie-poster-container">
          <div className="top-rated-rank">#{index + 1}</div>
          <img
            className="movie-poster"
            src={show.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${show.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={show.name}
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          <div className="movie-overlay">
            <button className="play-button">▶</button>
          </div>
        </div>
        <div className="movie-info">
          <div className="movie-title">{show.name}</div>
          <div className="movie-year">
            {new Date(show.first_air_date).getFullYear()}
          </div>
          <div className="movie-rating">
            ⭐ {show.vote_average?.toFixed(1)}
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="loading">Loading top rated content...</div>;
  }

  return (
    <div className="section">
      <h2 className="section-title">Top Rated All Time</h2>
      
      <div className="control-tabs">
        <button
          className={activeTab === 'movies' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('movies')}
        >
          Movies ({topRatedMovies.length})
        </button>
        <button
          className={activeTab === 'tv' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('tv')}
        >
          TV Shows ({topRatedTV.length})
        </button>
      </div>

      <div className="movie-grid">
        {activeTab === 'movies' && renderMovieList(topRatedMovies)}
        {activeTab === 'tv' && renderTVList(topRatedTV)}
      </div>

      {activeTab === 'movies' && topRatedMovies.length > 0 && (
        <div className="section-subtitle">
          Showing top {Math.min(12, topRatedMovies.length)} highest rated movies • Minimum rating: ⭐ {Math.min(...topRatedMovies.slice(0, 12).map(m => m.vote_average)).toFixed(1)}
        </div>
      )}
      {activeTab === 'tv' && topRatedTV.length > 0 && (
        <div className="section-subtitle">
          Showing top {Math.min(12, topRatedTV.length)} highest rated TV shows • Minimum rating: ⭐ {Math.min(...topRatedTV.slice(0, 12).map(s => s.vote_average)).toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default TopRatedSection;