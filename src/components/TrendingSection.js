import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getTrendingTV } from '../api';

const TrendingSection = ({ onMovieClick, onTVClick }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [timeWindow, setTimeWindow] = useState('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingData();
  }, [timeWindow]);

  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      const [movies, tv] = await Promise.all([
        getTrendingMovies(timeWindow),
        getTrendingTV(timeWindow)
      ]);
      setTrendingMovies(movies.results || movies);
      setTrendingTV(tv.results || tv);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMediaList = (mediaList) => {
    return mediaList.slice(0, 10).map((item, index) => (
      <div 
        key={item.id} 
        className="trending-item"
        onClick={() => {
          if (activeTab === 'movies' && onMovieClick) {
            onMovieClick(item.id);
          } else if (activeTab === 'tv' && onTVClick) {
            onTVClick(item.id);
          }
        }}
      >
        <div className="trending-rank">#{index + 1}</div>
        <img
          src={`${process.env.REACT_APP_BASEIMGURL}${item.poster_path}`}
          alt={item.title || item.name}
          className="trending-poster"
          onError={(e) => {
            e.target.src = '/placeholder-poster.jpg';
          }}
        />
        <div className="trending-info">
          <h3 className="trending-title">{item.title || item.name}</h3>
          <p className="trending-date">
            {item.release_date || item.first_air_date}
          </p>
          <div className="trending-rating">
            ⭐ {item.vote_average?.toFixed(1)}
          </div>
          <p className="trending-overview">
            {item.overview?.length > 150
              ? `${item.overview.substring(0, 150)}...`
              : item.overview}
          </p>
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="loading">Loading trending content...</div>;
  }

  return (
    <div className="section">
      <h2 className="section-title">Trending {timeWindow === 'day' ? 'Today' : 'This Week'}</h2>
      
      <div className="control-tabs">
        <button
          className={timeWindow === 'day' ? 'tab-button active' : 'tab-button'}
          onClick={() => setTimeWindow('day')}
        >
          Today
        </button>
        <button
          className={timeWindow === 'week' ? 'tab-button active' : 'tab-button'}
          onClick={() => setTimeWindow('week')}
        >
          This Week
        </button>
      </div>

      <div className="control-tabs">
        <button
          className={activeTab === 'movies' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('movies')}
        >
          Movies
        </button>
        <button
          className={activeTab === 'tv' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('tv')}
        >
          TV Shows
        </button>
      </div>

      <div className="trending-list">
        {activeTab === 'movies' && renderMediaList(trendingMovies)}
        {activeTab === 'tv' && renderMediaList(trendingTV)}
      </div>
    </div>
  );
};

export default TrendingSection;