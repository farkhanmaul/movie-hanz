import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieDetail from '../components/MovieDetail';

const MovieDetailPage = ({ onShowFilteredMovies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="movie-detail-page">
      <MovieDetail 
        movieId={id}
        onClose={handleClose}
        onMovieClick={handleMovieClick}
        onShowFilteredMovies={onShowFilteredMovies}
      />
    </div>
  );
};

export default MovieDetailPage;