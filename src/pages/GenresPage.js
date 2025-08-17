import React from 'react';
import GenreBrowse from '../components/GenreBrowse';

const GenresPage = ({ onMovieClick }) => {
  return <GenreBrowse onMovieClick={onMovieClick} onTVClick={onMovieClick} />;
};

export default GenresPage;