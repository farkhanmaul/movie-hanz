import React, { useState, useEffect } from 'react';
import { discoverMoviesByCast, discoverMoviesByCrew, discoverMoviesByCompany, getPersonDetails } from '../api';
import Pagination from './Pagination';

const FilteredMovies = ({ filterType, filterId, filterName, onMovieClick, onClose }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [personDetails, setPersonDetails] = useState(null);

  useEffect(() => {
    if (filterId) {
      fetchFilteredMovies(currentPage);
      if (filterType === 'cast' || filterType === 'crew') {
        fetchPersonDetails();
      }
    }
  }, [filterId, currentPage, filterType]);

  const fetchPersonDetails = async () => {
    try {
      const details = await getPersonDetails(filterId);
      setPersonDetails(details);
    } catch (err) {
      console.error('Error fetching person details:', err);
    }
  };

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

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{getFilterTitle()}</h2>
        <button className="back-button" onClick={onClose}>
          ← Back
        </button>
      </div>

      {/* Person Info for cast/crew */}
      {(filterType === 'cast' || filterType === 'crew') && personDetails && (
        <div className="person-info">
          <div className="person-photo-container">
            <img
              src={personDetails.profile_path 
                ? `${process.env.REACT_APP_BASEIMGURL}${personDetails.profile_path}`
                : '/placeholder-person.jpg'
              }
              alt={personDetails.name}
              className="person-photo"
              onError={(e) => {
                e.target.src = '/placeholder-person.jpg';
              }}
            />
          </div>
          <div className="person-details">
            <h3 className="person-name">{personDetails.name}</h3>
            {personDetails.birthday && (
              <p className="person-birthday">
                Born: {new Date(personDetails.birthday).toLocaleDateString()}
                {personDetails.place_of_birth && ` in ${personDetails.place_of_birth}`}
              </p>
            )}
            {personDetails.biography && (
              <p className="person-biography">
                {personDetails.biography.length > 300 
                  ? `${personDetails.biography.substring(0, 300)}...`
                  : personDetails.biography}
              </p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : movies.length > 0 ? (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="movie-card"
                onClick={() => onMovieClick(movie.id)}
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
  );
};

export default FilteredMovies;