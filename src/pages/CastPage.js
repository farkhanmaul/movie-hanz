import React from 'react';
import { useParams } from 'react-router-dom';
import FilteredMovies from '../components/FilteredMovies';

const CastPage = ({ onMovieClick, onClose }) => {
  const { id } = useParams();
  
  return (
    <FilteredMovies
      filterType="cast"
      filterId={id}
      filterName="Cast Member"
      onMovieClick={onMovieClick}
      onClose={onClose}
    />
  );
};

export default CastPage;