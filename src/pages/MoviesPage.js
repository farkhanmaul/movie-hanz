import React, { useState, useEffect } from 'react';
import { getMovieList } from '../api';
import Pagination from '../components/ui/Pagination';

const MoviesPage = ({ onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMovies(currentPage);
  }, [currentPage]);

  const loadMovies = async (page) => {
    setLoading(true);
    try {
      const result = await getMovieList(page);
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

  return (
    <div className="section">
      <h2 className="section-title">Popular Movies</h2>
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