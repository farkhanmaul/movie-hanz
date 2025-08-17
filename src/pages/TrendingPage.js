import React from 'react';
import TrendingSection from '../components/TrendingSection';

const TrendingPage = ({ onMovieClick }) => {
  return <TrendingSection onMovieClick={onMovieClick} onTVClick={onMovieClick} />;
};

export default TrendingPage;