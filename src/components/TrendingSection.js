import React, { useState } from 'react';
import { getTrendingMovies, getTrendingTV } from '../api';
import { useApi } from '../hooks/useApi';
import { getImageUrl, formatRating } from '../utils/helpers';
import LoadingSpinner from './ui/LoadingSpinner';

const TrendingSection = ({ onMovieClick, onTVClick }) => {
  const [activeTab, setActiveTab] = useState('movies');
  const [timeWindow, setTimeWindow] = useState('day');

  const { data: trendingMovies, loading: moviesLoading } = useApi(
    () => getTrendingMovies(timeWindow), [timeWindow]
  );
  
  const { data: trendingTV, loading: tvLoading } = useApi(
    () => getTrendingTV(timeWindow), [timeWindow]
  );

  const loading = moviesLoading || tvLoading;
  const currentData = activeTab === 'movies' ? trendingMovies?.results : trendingTV?.results;

  const handleItemClick = (item) => {
    if (activeTab === 'movies' && onMovieClick) onMovieClick(item.id);
    else if (activeTab === 'tv' && onTVClick) onTVClick(item.id);
  };

  if (loading) return <LoadingSpinner size="lg" className="mx-auto my-8" />;

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2 className="section-title">Trending {timeWindow === 'day' ? 'Today' : 'This Week'}</h2>
        <div className="trending-controls">
          <div className="time-toggle">
            {['day', 'week'].map(period => (
              <button
                key={period}
                onClick={() => setTimeWindow(period)}
                className={`time-btn ${timeWindow === period ? 'active' : ''}`}
              >
                {period === 'day' ? 'Today' : 'This Week'}
              </button>
            ))}
          </div>
          <div className="tab-toggle">
            {[{ key: 'movies', label: 'Movies' }, { key: 'tv', label: 'TV Shows' }].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="trending-grid">
        {currentData?.slice(0, 10).map((item, index) => (
          <div key={item.id} className="trending-item" onClick={() => handleItemClick(item)}>
            <div className="trending-rank">#{index + 1}</div>
            <img
              src={getImageUrl(item.poster_path, 'poster') || '/placeholder-poster.jpg'}
              alt={item.title || item.name}
              className="trending-poster"
              onError={(e) => { e.target.src = '/placeholder-poster.jpg'; }}
            />
            <div className="trending-info">
              <h3 className="trending-title">{item.title || item.name}</h3>
              <div className="trending-meta">
                <span className="trending-rating">⭐ {formatRating(item.vote_average)}</span>
                <span className="trending-year">
                  {new Date(item.release_date || item.first_air_date).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;