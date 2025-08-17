import React, { useState, useEffect } from 'react';
import { getPopularTV } from '../api';

const TVShowsPage = ({ onMovieClick }) => {
  const [tvShows, setTVShows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTVShows();
  }, []);

  const loadTVShows = async () => {
    setLoading(true);
    try {
      const result = await getPopularTV();
      setTVShows(result);
    } catch (error) {
      console.error('Failed to load TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">Popular TV Shows</h2>
      {loading ? (
        <div className="loading">Loading TV shows...</div>
      ) : (
        <div className="movie-grid">
          {tvShows.map((show) => (
            <div 
              key={show.id} 
              className="movie-card"
              onClick={() => onMovieClick(show.id)}
            >
              <div className="movie-poster-container">
                <img
                  className="Movie-img"
                  alt={show.name}
                  src={show.poster_path 
                    ? `${process.env.REACT_APP_BASEIMGURL}${show.poster_path}`
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
};

export default TVShowsPage;