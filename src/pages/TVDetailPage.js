import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TVDetail from '../components/TVDetail';

const TVDetailPage = ({ onShowFilteredMovies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleTVClick = (tvId) => {
    navigate(`/tv/${tvId}`);
  };

  return (
    <div className="movie-detail-page">
      <TVDetail 
        tvId={id}
        onClose={handleClose}
        onMovieClick={handleMovieClick}
        onTVClick={handleTVClick}
        onShowFilteredMovies={onShowFilteredMovies}
      />
    </div>
  );
};

export default TVDetailPage;