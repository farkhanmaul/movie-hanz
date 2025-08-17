import React from 'react';
import { useParams } from 'react-router-dom';
import FilteredMovies from '../components/FilteredMovies';

const CrewPage = ({ onMovieClick, onClose }) => {
  const { id } = useParams();
  
  return (
    <FilteredMovies
      filterType="crew"
      filterId={id}
      filterName="Crew Member"
      onMovieClick={onMovieClick}
      onClose={onClose}
    />
  );
};

export default CrewPage;