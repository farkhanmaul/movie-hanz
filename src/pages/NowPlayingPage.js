import React from 'react';
import NowPlayingUpcoming from '../components/NowPlayingUpcoming';

const NowPlayingPage = ({ onMovieClick }) => {
  return <NowPlayingUpcoming onMovieClick={onMovieClick} />;
};

export default NowPlayingPage;