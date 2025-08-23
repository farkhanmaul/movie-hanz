import React, { useState, useEffect, useCallback } from 'react';
import { getTopRatedMovies, getTopRatedTV } from '../api';
import { getImageUrl, formatRating } from '../utils/helpers';
import LoadingSpinner from './ui/LoadingSpinner';
import Pagination from './ui/Pagination';

const TopRatedSection = ({ onMovieClick, onTVClick }) => {
  const [activeTab, setActiveTab] = useState('movies');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = activeTab === 'movies' 
        ? await getTopRatedMovies(currentPage)
        : await getTopRatedTV(currentPage);
      setData(result);
    } catch (error) {
      console.error('Error fetching top rated:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };


  const handleItemClick = (item) => {
    if (activeTab === 'movies' && onMovieClick) onMovieClick(item.id);
    else if (activeTab === 'tv' && onTVClick) onTVClick(item.id);
  };

  if (loading) return <LoadingSpinner size="lg" className="mx-auto my-8" />;

  const currentData = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 100);

  return (
    <section className="top-rated-section">
      <div className="section-header">
        <h2 className="section-title">Top Rated</h2>
        <div className="section-controls">
          <div className="tab-toggle">
            {[{ key: 'movies', label: 'Movies' }, { key: 'tv', label: 'TV Shows' }].map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ranking-list">
        {currentData.map((item, index) => (
          <div key={item.id} className="ranking-item" onClick={() => handleItemClick(item)}>
            <div className="ranking-number">
              <span className="rank-text">#{(currentPage - 1) * 20 + index + 1}</span>
            </div>
            <div className="ranking-poster">
              <img
                src={getImageUrl(item.poster_path, 'poster') || '/placeholder-poster.svg'}
                alt={item.title || item.name}
                onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
              />
            </div>
            <div className="ranking-info">
              <h3 className="ranking-title">{item.title || item.name}</h3>
              <div className="ranking-meta">
                <span className="ranking-rating">⭐ {formatRating(item.vote_average)}</span>
                <span className="ranking-year">
                  {new Date(item.release_date || item.first_air_date).getFullYear()}
                </span>
              </div>
              <p className="ranking-overview">
                {item.overview?.substring(0, 120)}...
              </p>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-8"
      />
    </section>
  );
};

export default TopRatedSection;