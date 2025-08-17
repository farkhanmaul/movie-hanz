import React, { useState, useEffect } from 'react';
import { discoverMoviesByCast, discoverMoviesByCrew, discoverMoviesByCompany } from '../api';
import Pagination from './Pagination';

const FilteredMovies = ({ filterType, filterId, filterName, onMovieClick, onClose }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (filterId) {
      fetchFilteredMovies(currentPage);
    }
  }, [filterId, currentPage, filterType]);

  const fetchFilteredMovies = async (page) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (filterType) {
        case 'cast':
          result = await discoverMoviesByCast(filterId, page);
          break;
        case 'crew':
          result = await discoverMoviesByCrew(filterId, page);
          break;
        case 'company':
          result = await discoverMoviesByCompany(filterId, page);
          break;
        default:
          throw new Error('Invalid filter type');
      }
      setMovies(result.results || []);
      setTotalPages(Math.min(result.total_pages || 1, 500));
    } catch (err) {
      setError('Failed to load filtered movies');
      console.error('Error fetching filtered movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFilterTitle = () => {
    switch (filterType) {
      case 'cast':
        return `Movies starring ${filterName}`;
      case 'crew':
        return `Movies by ${filterName}`;
      case 'company':
        return `Movies by ${filterName}`;
      default:
        return `Movies featuring ${filterName}`;
    }
  };

  if (loading) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <button className="close-button" onClick={onClose}>×</button>
          <div className="loading">Loading movies...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <button className="close-button" onClick={onClose}>×</button>
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="movie-detail-content">
          <div className="movie-detail-section">
            <h2 className="section-title">{getFilterTitle()}</h2>
            <div className="content-count">
              {movies.length} movies found
            </div>
          </div>

          {movies.length > 0 ? (
            <>
              <div className="movie-grid">
                {movies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="movie-card"
                    onClick={() => {
                      onClose();
                      onMovieClick(movie.id);
                    }}
                  >
                    <div className="movie-poster-container">
                      <img
                        className="Movie-img"
                        alt={movie.title}
                        src={movie.poster_path 
                          ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
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
                      <div className="Movie-title">{movie.title}</div>
                      <div className="Movie-date">{movie.release_date}</div>
                      <div className="Movie-rate">⭐ {movie.vote_average?.toFixed(1)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              )}
            </>
          ) : (
            <div className="no-results">
              No movies found for {filterName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilteredMovies;