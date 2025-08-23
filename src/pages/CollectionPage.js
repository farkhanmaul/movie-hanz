import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieCollection } from '../api';

const CollectionPage = ({ onMovieClick, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('chronological'); // chronological, rating, popularity

  useEffect(() => {
    loadCollection();
  }, [id]);

  const loadCollection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovieCollection(id);
      setCollection(data);
    } catch (err) {
      setError('Failed to load collection');
      console.error('Error loading collection:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSortedMovies = () => {
    if (!collection?.parts) return [];
    
    let movies = [...collection.parts];
    
    switch (sortBy) {
      case 'chronological':
        return movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      case 'rating':
        return movies.sort((a, b) => b.vote_average - a.vote_average);
      case 'popularity':
        return movies.sort((a, b) => b.popularity - a.popularity);
      default:
        return movies;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const calculateStats = () => {
    if (!collection?.parts?.length) return null;
    
    const movies = collection.parts;
    const totalRevenue = movies.reduce((sum, movie) => sum + (movie.revenue || 0), 0);
    const totalBudget = movies.reduce((sum, movie) => sum + (movie.budget || 0), 0);
    const avgRating = movies.reduce((sum, movie) => sum + movie.vote_average, 0) / movies.length;
    const totalVotes = movies.reduce((sum, movie) => sum + movie.vote_count, 0);
    
    return {
      totalMovies: movies.length,
      totalRevenue,
      totalBudget,
      avgRating: avgRating.toFixed(1),
      totalVotes,
      profit: totalRevenue - totalBudget
    };
  };

  const handleMovieClick = (movieId) => {
    onMovieClick(movieId);
  };

  const handleBackClick = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="collection-page">
        <div className="loading">Loading collection...</div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="collection-page">
        <button className="back-button" onClick={handleBackClick}>
          ← Back
        </button>
        <div className="error-message">
          {error || 'Collection not found'}
          <button onClick={loadCollection} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const sortedMovies = getSortedMovies();

  return (
    <div className="collection-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back
      </button>
      
      {/* Collection Header */}
      <div 
        className="collection-hero"
        style={{
          backgroundImage: collection.backdrop_path 
            ? `url(https://image.tmdb.org/t/p/original${collection.backdrop_path})`
            : 'none'
        }}
      >
        <div className="collection-hero-overlay">
          <div className="collection-info">
            {collection.poster_path && (
              <div className="collection-poster">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${collection.poster_path}`}
                  alt={collection.name}
                />
              </div>
            )}
            <div className="collection-details">
              <h1 className="collection-title">{collection.name}</h1>
              {collection.overview && (
                <p className="collection-overview">{collection.overview}</p>
              )}
              
              {/* Collection Statistics */}
              {stats && (
                <div className="collection-stats">
                  <div className="stat-item">
                    <span className="stat-label">Movies:</span>
                    <span className="stat-value">{stats.totalMovies}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Avg Rating:</span>
                    <span className="stat-value">⭐ {stats.avgRating}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Revenue:</span>
                    <span className="stat-value">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                  {stats.profit > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Profit:</span>
                      <span className="stat-value profit-positive">
                        +{formatCurrency(stats.profit)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="collection-controls">
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="chronological">Release Date (Chronological)</option>
            <option value="rating">Rating (Highest First)</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="collection-movies">
        <h2 className="section-title">
          Movies in Collection ({sortedMovies.length})
        </h2>
        <div className="movie-grid">
          {sortedMovies.map((movie, index) => (
            <div 
              key={movie.id}
              className="movie-card collection-movie-card"
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="movie-poster-container">
                <img
                  className="Movie-img"
                  alt={movie.title}
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/placeholder-poster.svg'
                  }
                  onError={(e) => {
                    e.target.src = '/placeholder-poster.svg';
                  }}
                />
                <div className="movie-overlay">
                  <button className="play-button">▶</button>
                </div>
                {sortBy === 'chronological' && (
                  <div className="collection-order">#{index + 1}</div>
                )}
              </div>
              <div className="movie-info">
                <div className="Movie-title">{movie.title}</div>
                <div className="Movie-date">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </div>
                <div className="Movie-rate">⭐ {movie.vote_average?.toFixed(1)}</div>
                {movie.revenue && (
                  <div className="movie-revenue">
                    📈 {formatCurrency(movie.revenue)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;