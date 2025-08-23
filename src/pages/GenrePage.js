import React from 'react';
import { useParams } from 'react-router-dom';
import FilteredMovies from '../components/FilteredMovies';

const GenrePage = ({ onMovieClick, onClose }) => {
  const { id } = useParams();
  
  return (
    <FilteredMovies
      filterType="genre"
      filterId={id}
      filterName="Genre"
      onMovieClick={onMovieClick}
      onClose={onClose}
    />
  );
};

export default GenrePage;