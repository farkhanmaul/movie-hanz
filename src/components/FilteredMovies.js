import React, { useState, useEffect } from 'react';
import { discoverMoviesByCast, discoverMoviesByCrew, discoverMoviesByCompany, getPersonDetails } from '../api';
import Pagination from './ui/Pagination';

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
        <div className="person-hero">
          <div className="person-hero-photo">
            <img
              src={personDetails.profile_path 
                ? `${process.env.REACT_APP_BASEIMGURL}${personDetails.profile_path}`
                : '/placeholder-person.jpg'
              }
              alt={personDetails.name}
              className="person-large-photo"
              onError={(e) => {
                e.target.src = '/placeholder-person.jpg';
              }}
            />
          </div>
          <div className="person-hero-details">
            <h1 className="person-hero-name">{personDetails.name}</h1>
            <div className="person-meta">
              {personDetails.birthday && (
                <div className="person-birthday">
                  <strong>Born:</strong> {new Date(personDetails.birthday).toLocaleDateString()}
                  {personDetails.place_of_birth && ` in ${personDetails.place_of_birth}`}
                </div>
              )}
              {personDetails.deathday && (
                <div className="person-deathday">
                  <strong>Died:</strong> {new Date(personDetails.deathday).toLocaleDateString()}
                </div>
              )}
              {personDetails.known_for_department && (
                <div className="person-department">
                  <strong>Known for:</strong> {personDetails.known_for_department}
                </div>
              )}
            </div>
            {personDetails.biography && (
              <div className="person-biography">
                <h3>Biography</h3>
                <p>
                  {personDetails.biography.length > 800 
                    ? `${personDetails.biography.substring(0, 800)}...`
                    : personDetails.biography}
                </p>
              </div>
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
          <div className="movies-section">
            <h3 className="movies-section-title">
              {filterType === 'cast' ? 'Movies & TV Shows' : 
               filterType === 'crew' ? 'Filmography' : 
               'Productions'}
            </h3>
            <div className="movie-grid-small">
              {movies
                .sort((a, b) => {
                  // Sort by release date (newest first)
                  const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01');
                  const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01');
                  return dateB - dateA;
                })
                .map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-card-small"
                  onClick={() => onMovieClick(movie.id)}
                >
                  <div className="movie-poster-container-small">
                    <img
                      className="Movie-img-small"
                      alt={movie.title || movie.name}
                      src={movie.poster_path 
                        ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
                        : '/placeholder-poster.jpg'
                      }
                      onError={(e) => {
                        e.target.src = '/placeholder-poster.jpg';
                      }}
                    />
                    <div className="movie-overlay-small">
                      <button className="play-button-small">▶</button>
                    </div>
                  </div>
                  <div className="movie-info-small">
                    <div className="Movie-title-small">{movie.title || movie.name}</div>
                    <div className="Movie-date-small">
                      {movie.release_date || movie.first_air_date 
                        ? new Date(movie.release_date || movie.first_air_date).getFullYear()
                        : 'N/A'}
                    </div>
                    <div className="Movie-rate-small">⭐ {movie.vote_average?.toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>
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