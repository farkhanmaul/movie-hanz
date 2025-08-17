import React from 'react';
import { useParams } from 'react-router-dom';
import FilteredMovies from '../components/FilteredMovies';

const CompanyPage = ({ onMovieClick, onClose }) => {
  const { id } = useParams();
  
  return (
    <FilteredMovies
      filterType="company"
      filterId={id}
      filterName="Production Company"
      onMovieClick={onMovieClick}
      onClose={onClose}
    />
  );
};

export default CompanyPage;