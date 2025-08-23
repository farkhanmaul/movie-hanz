import React, { useState, useEffect } from 'react';
import { getMovieList, discoverMoviesAdvanced, getMovieGenres } from '../api';
import Pagination from '../components/ui/Pagination';

const MoviesPage = ({ onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    sortBy: 'popularity.desc',
    minRating: 0,
    maxRating: 10
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMovies(currentPage);
  }, [currentPage, filters]);

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    try {
      const genreList = await getMovieGenres();
      setGenres(genreList);
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  };

  const loadMovies = async (page) => {
    setLoading(true);
    try {
      let result;
      const hasFilters = filters.genre || filters.year || filters.sortBy !== 'popularity.desc' || filters.minRating > 0 || filters.maxRating < 10;
      
      if (hasFilters) {
        result = await discoverMoviesAdvanced({
          genre: filters.genre,
          year: filters.year,
          sortBy: filters.sortBy,
          minRating: filters.minRating,
          maxRating: filters.maxRating,
          page
        });
      } else {
        result = await getMovieList(page);
      }
      
      setMovies(result.results);
      setTotalPages(Math.min(result.total_pages, 500));
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      genre: '',
      year: '',
      sortBy: 'popularity.desc',
      minRating: 0,
      maxRating: 10
    });
    setCurrentPage(1);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Popular Movies</h2>
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? '⚙️ Hide Filters' : '⚙️ Show Filters'}
        </button>
      </div>
      
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Genre:</label>
              <select 
                value={filters.genre} 
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Year:</label>
              <select 
                value={filters.year} 
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort By:</label>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Newest</option>
                <option value="release_date.asc">Oldest</option>
                <option value="title.asc">Title A-Z</option>
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>Min Rating: {filters.minRating}</label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.5"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="filter-group">
              <label>Max Rating: {filters.maxRating}</label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.5"
                value={filters.maxRating}
                onChange={(e) => handleFilterChange('maxRating', parseFloat(e.target.value))}
              />
            </div>
            
            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default MoviesPage;