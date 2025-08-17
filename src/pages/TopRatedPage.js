import React from 'react';
import TopRatedSection from '../components/TopRatedSection';

const TopRatedPage = ({ onMovieClick }) => {
  return <TopRatedSection onMovieClick={onMovieClick} onTVClick={onMovieClick} />;
};

export default TopRatedPage;