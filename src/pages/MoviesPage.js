import React, { useState, useEffect } from 'react';
import { getMovieList, discoverMoviesAdvanced, getMovieGenres, getMovieVideos } from '../api';
import Pagination from '../components/ui/Pagination';
import TrailerModal from '../components/ui/TrailerModal';

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
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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

  // Ensure consistent grid layout by padding incomplete rows
  const getGridMovies = (movieList) => {
    const itemsPerRow = window.innerWidth <= 480 ? 2 : window.innerWidth <= 768 ? 3 : window.innerWidth <= 1024 ? 4 : 5;
    const totalRows = Math.ceil(movieList.length / itemsPerRow);
    const totalItemsNeeded = totalRows * itemsPerRow;
    
    // Pad with empty items if needed for last row
    const paddedMovies = [...movieList];
    while (paddedMovies.length < totalItemsNeeded && paddedMovies.length % itemsPerRow !== 0) {
      paddedMovies.push(null); // null represents empty slot
    }
    return paddedMovies;
  };

  const handlePlayTrailer = async (e, movieId) => {
    e.stopPropagation(); // Prevent movie card click
    try {
      const videos = await getMovieVideos(movieId);
      const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        setSelectedTrailer(trailer);
        setShowTrailer(true);
      } else {
        alert('No trailer available for this movie');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      alert('Failed to load trailer');
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setSelectedTrailer(null);
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">Popular Movies</h2>
        <div className="header-controls">
          <div className="view-toggle">
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
              </svg>
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
              </svg>
            </button>
          </div>
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? '⚙️ Hide Filters' : '⚙️ Show Filters'}
          </button>
        </div>
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
          <div className={`movies-container ${viewMode}-view`}>
            {viewMode === 'grid' ? (
              // Grid View
              getGridMovies(movies).map((movie, index) => (
                movie ? (
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
                          : '/placeholder-poster.svg'
                        }
                        onError={(e) => {
                          e.target.src = '/placeholder-poster.svg';
                        }}
                      />
                      <div className="movie-overlay">
                        <button 
                          className="play-button"
                          onClick={(e) => handlePlayTrailer(e, movie.id)}
                          title="Watch Trailer"
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                    <div className="movie-info">
                      <div className="Movie-title">{movie.title}</div>
                      <div className="Movie-date">{movie.release_date}</div>
                      <div className="Movie-rate">⭐ {movie.vote_average?.toFixed(1)}</div>
                    </div>
                  </div>
                ) : (
                  <div key={`empty-${index}`} className="movie-card-placeholder"></div>
                )
              ))
            ) : (
              // List View
              movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="movie-list-item"
                  onClick={() => onMovieClick(movie.id)}
                >
                  <div className="movie-list-poster">
                    <img
                      className="Movie-img-list"
                      alt={movie.title}
                      src={movie.poster_path 
                        ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
                        : '/placeholder-poster.svg'
                      }
                      onError={(e) => {
                        e.target.src = '/placeholder-poster.svg';
                      }}
                    />
                    <button 
                      className="play-button-list"
                      onClick={(e) => handlePlayTrailer(e, movie.id)}
                      title="Watch Trailer"
                    >
                      ▶
                    </button>
                  </div>
                  <div className="movie-list-content">
                    <div className="movie-list-header">
                      <h3 className="movie-list-title">{movie.title}</h3>
                      <div className="movie-list-meta">
                        <span className="movie-list-year">{movie.release_date?.split('-')[0]}</span>
                        <span className="movie-list-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="movie-list-overview">
                      {movie.overview ? 
                        (movie.overview.length > 200 ? 
                          `${movie.overview.substring(0, 200)}...` : 
                          movie.overview
                        ) : 
                        'No description available.'
                      }
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </>
      )}
      
      <TrailerModal 
        trailerVideo={selectedTrailer}
        isOpen={showTrailer}
        onClose={handleCloseTrailer}
      />
    </div>
  );
};

export default MoviesPage;