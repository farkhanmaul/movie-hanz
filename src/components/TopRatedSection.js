import React, { useState, useEffect } from 'react';
import { getTopRatedMovies, getTopRatedTV } from '../api';
import Pagination from './Pagination';

const TopRatedSection = ({ onMovieClick, onTVClick }) => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchTopRatedData();
  }, [currentPage, activeTab]);

  const fetchTopRatedData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'movies') {
        const movies = await getTopRatedMovies(currentPage);
        setTopRatedMovies(movies.results || movies);
        setTotalPages(Math.min(movies.total_pages || 1, 100)); // Limit to 100 pages
      } else {
        const tv = await getTopRatedTV(currentPage);
        setTopRatedTV(tv.results || tv);
        setTotalPages(Math.min(tv.total_pages || 1, 100)); // Limit to 100 pages
      }
    } catch (error) {
      console.error('Error fetching top rated data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page when switching tabs
  };

  const renderMovieList = (movies) => {
    return movies.map((movie, index) => (
      <div 
        key={movie.id} 
        className="ranking-item"
        onClick={() => onMovieClick && onMovieClick(movie.id)}
      >
        <div className="ranking-number">
          <span className="rank-text">#{(currentPage - 1) * 20 + index + 1}</span>
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
    return tvShows.map((show, index) => (
      <div 
        key={show.id} 
        className="ranking-item"
        onClick={() => onTVClick && onTVClick(show.id)}
      >
        <div className="ranking-number">
          <span className="rank-text">#{(currentPage - 1) * 20 + index + 1}</span>
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
          onClick={() => handleTabChange('movies')}
        >
          Movies
        </button>
        <button
          className={activeTab === 'tv' ? 'tab-button active' : 'tab-button'}
          onClick={() => handleTabChange('tv')}
        >
          TV Shows
        </button>
      </div>

      <div className="ranking-list">
        {activeTab === 'movies' && renderMovieList(topRatedMovies)}
        {activeTab === 'tv' && renderTVList(topRatedTV)}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        loading={loading}
      />

      {activeTab === 'movies' && topRatedMovies.length > 0 && (
        <div className="section-subtitle">
          Showing page {currentPage} of {totalPages} • {topRatedMovies.length} highest rated movies on this page
        </div>
      )}
      {activeTab === 'tv' && topRatedTV.length > 0 && (
        <div className="section-subtitle">
          Showing page {currentPage} of {totalPages} • {topRatedTV.length} highest rated TV shows on this page
        </div>
      )}
    </div>
  );
};

export default TopRatedSection;