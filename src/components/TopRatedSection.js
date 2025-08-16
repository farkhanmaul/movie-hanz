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
      setTopRatedMovies(movies.results || movies);
      setTopRatedTV(tv.results || tv);
    } catch (error) {
      console.error('Error fetching top rated data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovieList = (movies) => {
    return movies.slice(0, 20).map((movie, index) => (
      <div 
        key={movie.id} 
        className="ranking-item"
        onClick={() => onMovieClick && onMovieClick(movie.id)}
      >
        <div className="ranking-number">
          <span className="rank-text">#{index + 1}</span>
        </div>
        <div className="ranking-poster">
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
        </div>
        <div className="ranking-info">
          <h3 className="ranking-title">{movie.title}</h3>
          <div className="ranking-meta">
            <span className="ranking-year">{new Date(movie.release_date).getFullYear()}</span>
            <span className="ranking-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span className="ranking-votes">{movie.vote_count?.toLocaleString()} votes</span>
          </div>
          <p className="ranking-overview">
            {movie.overview?.length > 150
              ? `${movie.overview.substring(0, 150)}...`
              : movie.overview}
          </p>
        </div>
        <div className="ranking-score">
          <div className="score-number">{movie.vote_average?.toFixed(1)}</div>
          <div className="score-label">Rating</div>
        </div>
      </div>
    ));
  };

  const renderTVList = (tvShows) => {
    return tvShows.slice(0, 20).map((show, index) => (
      <div 
        key={show.id} 
        className="ranking-item"
        onClick={() => onTVClick && onTVClick(show.id)}
      >
        <div className="ranking-number">
          <span className="rank-text">#{index + 1}</span>
        </div>
        <div className="ranking-poster">
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
        </div>
        <div className="ranking-info">
          <h3 className="ranking-title">{show.name}</h3>
          <div className="ranking-meta">
            <span className="ranking-year">{new Date(show.first_air_date).getFullYear()}</span>
            <span className="ranking-rating">⭐ {show.vote_average?.toFixed(1)}</span>
            <span className="ranking-votes">{show.vote_count?.toLocaleString()} votes</span>
          </div>
          <p className="ranking-overview">
            {show.overview?.length > 150
              ? `${show.overview.substring(0, 150)}...`
              : show.overview}
          </p>
        </div>
        <div className="ranking-score">
          <div className="score-number">{show.vote_average?.toFixed(1)}</div>
          <div className="score-label">Rating</div>
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

      <div className="ranking-list">
        {activeTab === 'movies' && renderMovieList(topRatedMovies)}
        {activeTab === 'tv' && renderTVList(topRatedTV)}
      </div>

      {activeTab === 'movies' && topRatedMovies.length > 0 && (
        <div className="section-subtitle">
          Showing top {Math.min(20, topRatedMovies.length)} highest rated movies • Minimum rating: ⭐ {Math.min(...topRatedMovies.slice(0, 20).map(m => m.vote_average)).toFixed(1)}
        </div>
      )}
      {activeTab === 'tv' && topRatedTV.length > 0 && (
        <div className="section-subtitle">
          Showing top {Math.min(20, topRatedTV.length)} highest rated TV shows • Minimum rating: ⭐ {Math.min(...topRatedTV.slice(0, 20).map(s => s.vote_average)).toFixed(1)}
        </div>
      )}
    </div>
  );
};

export default TopRatedSection;