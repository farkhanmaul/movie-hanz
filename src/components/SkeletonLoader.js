import React from 'react';

const SkeletonMovieCard = () => (
  <div className="skeleton-movie-card">
    <div className="skeleton-poster"></div>
    <div className="skeleton-info">
      <div className="skeleton-title"></div>
      <div className="skeleton-date"></div>
      <div className="skeleton-rating"></div>
    </div>
  </div>
);

const SkeletonLoader = ({ count = 10, type = 'grid' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <SkeletonMovieCard key={i} />
  ));

  if (type === 'grid') {
    return (
      <div className="movie-grid">
        {skeletons}
      </div>
    );
  }

  return (
    <div className="skeleton-container">
      {skeletons}
    </div>
  );
};

export default SkeletonLoader;