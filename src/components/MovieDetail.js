import React, { useState, useEffect } from 'react';
import { getMovieDetails } from '../api';

const MovieDetail = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMovieDetails(movieId);
      setMovie(data);
    } catch (err) {
      setError('Failed to load movie details');
      console.error('Error fetching movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <div className="loading">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <button className="close-button" onClick={onClose}>×</button>
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path 
    ? `${process.env.REACT_APP_BASEIMGURL}${movie.poster_path}`
    : '/placeholder-poster.jpg';

  const trailerVideo = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* Header with backdrop */}
        <div 
          className="movie-detail-header"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
            backgroundColor: backdropUrl ? 'transparent' : '#1a1a1a'
          }}
        >
          <div className="movie-detail-header-overlay">
            <div className="movie-detail-poster">
              <img src={posterUrl} alt={movie.title} />
            </div>
            <div className="movie-detail-header-info">
              <h1 className="movie-detail-title">{movie.title}</h1>
              {movie.tagline && (
                <p className="movie-detail-tagline">"{movie.tagline}"</p>
              )}
              <div className="movie-detail-meta">
                <span className="movie-detail-year">
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span className="movie-detail-runtime">
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="movie-detail-rating">
                  ⭐ {movie.vote_average?.toFixed(1)}/10
                </span>
              </div>
              <div className="movie-detail-genres">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="movie-detail-content">
          {/* Overview */}
          <section className="movie-detail-section">
            <h3>Overview</h3>
            <p className="movie-detail-overview">
              {movie.overview || 'No overview available.'}
            </p>
          </section>

          {/* Movie Info */}
          <section className="movie-detail-section">
            <h3>Movie Information</h3>
            <div className="movie-info-grid">
              <div className="info-item">
                <strong>Release Date:</strong>
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <strong>Status:</strong>
                <span>{movie.status}</span>
              </div>
              <div className="info-item">
                <strong>Budget:</strong>
                <span>{formatCurrency(movie.budget)}</span>
              </div>
              <div className="info-item">
                <strong>Revenue:</strong>
                <span>{formatCurrency(movie.revenue)}</span>
              </div>
              <div className="info-item">
                <strong>Languages:</strong>
                <span>
                  {movie.spoken_languages?.map(lang => lang.english_name).join(', ') || 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <strong>Production:</strong>
                <span>
                  {movie.production_companies?.map(company => company.name).join(', ') || 'N/A'}
                </span>
              </div>
            </div>
          </section>

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <section className="movie-detail-section">
              <h3>Cast</h3>
              <div className="cast-list">
                {movie.credits.cast.slice(0, 10).map(person => (
                  <div key={person.id} className="cast-member">
                    <img
                      src={person.profile_path 
                        ? `${process.env.REACT_APP_BASEIMGURL}${person.profile_path}`
                        : '/placeholder-person.jpg'
                      }
                      alt={person.name}
                      className="cast-photo"
                    />
                    <div className="cast-info">
                      <div className="cast-name">{person.name}</div>
                      <div className="cast-character">{person.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trailer */}
          {trailerVideo && (
            <section className="movie-detail-section">
              <h3>Trailer</h3>
              <div className="trailer-container">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerVideo.key}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}

          {/* Similar Movies */}
          {movie.similar?.results && movie.similar.results.length > 0 && (
            <section className="movie-detail-section">
              <h3>Similar Movies</h3>
              <div className="similar-movies">
                {movie.similar.results.slice(0, 6).map(similarMovie => (
                  <div key={similarMovie.id} className="similar-movie">
                    <img
                      src={similarMovie.poster_path 
                        ? `${process.env.REACT_APP_BASEIMGURL}${similarMovie.poster_path}`
                        : '/placeholder-poster.jpg'
                      }
                      alt={similarMovie.title}
                      className="similar-movie-poster"
                    />
                    <div className="similar-movie-title">{similarMovie.title}</div>
                    <div className="similar-movie-rating">
                      ⭐ {similarMovie.vote_average?.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;