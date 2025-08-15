import React, { useState, useEffect } from 'react';
import { getTrendingMovies, getTrendingTV } from '../api';

const TrendingSection = () => {
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
      setTrendingMovies(movies);
      setTrendingTV(tv);
    } catch (error) {
      console.error('Error fetching trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMediaList = (mediaList) => {
    return mediaList.slice(0, 10).map((item, index) => (
      <div key={item.id} className="trending-item">
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
    <div className="trending-section">
      <h2>🔥 Trending {timeWindow === 'day' ? 'Today' : 'This Week'}</h2>
      
      <div className="trending-controls">
        <div className="time-selector">
          <button
            className={timeWindow === 'day' ? 'active' : ''}
            onClick={() => setTimeWindow('day')}
          >
            Today
          </button>
          <button
            className={timeWindow === 'week' ? 'active' : ''}
            onClick={() => setTimeWindow('week')}
          >
            This Week
          </button>
        </div>

        <div className="tab-selector">
          <button
            className={activeTab === 'movies' ? 'active' : ''}
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
          <button
            className={activeTab === 'tv' ? 'active' : ''}
            onClick={() => setActiveTab('tv')}
          >
            TV Shows
          </button>
        </div>
      </div>

      <div className="trending-content">
        {activeTab === 'movies' && renderMediaList(trendingMovies)}
        {activeTab === 'tv' && renderMediaList(trendingTV)}
      </div>
    </div>
  );
};

export default TrendingSection;