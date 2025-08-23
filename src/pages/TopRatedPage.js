import React from 'react';
import TopRatedSection from '../components/TopRatedSection';

const TopRatedPage = ({ onMovieClick, onTVClick }) => {
  return <TopRatedSection onMovieClick={onMovieClick} onTVClick={onTVClick} />;
};

export default TopRatedPage;