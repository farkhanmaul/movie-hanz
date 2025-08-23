import React, { useState, useEffect, useCallback } from 'react';
import { getTVDetails } from '../api';
import { useNavigate } from 'react-router-dom';
import WatchProviders from './WatchProviders';
import ContentRatings from './ContentRatings';

const TVDetail = ({ tvId, onClose, onMovieClick, onTVClick, onShowFilteredMovies }) => {
  const [tvShow, setTVShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  const fetchTVDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTVDetails(tvId);
      setTVShow(data);
    } catch (err) {
      setError('Failed to load TV show details');
      console.error('Error fetching TV details:', err);
    } finally {
      setLoading(false);
    }
  }, [tvId]);

  useEffect(() => {
    if (tvId) {
      fetchTVDetails();
    }
  }, [tvId, fetchTVDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTrailerClick = () => {
    setShowTrailer(true);
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  if (loading) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <div className="loading">Loading TV show details...</div>
        </div>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <button className="close-button" onClick={onClose}>×</button>
          <div className="error-message">
            {error || 'TV show not found'}
          </div>
        </div>
      </div>
    );
  }

  // Find trailer video
  const trailerVideo = tvShow.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="tv-detail-page">
      <div className="movie-detail-overlay">
        <div className="movie-detail-container scrollable-container">
          <button className="close-button" onClick={onClose}>×</button>
          
          {/* Header with backdrop */}
          <div 
            className="movie-detail-header"
            style={{
              backgroundImage: tvShow.backdrop_path 
                ? `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
                : 'none'
            }}
          >
            <div className="movie-detail-header-overlay">
              <div className="movie-detail-poster">
                <img 
                  src={tvShow.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                    : '/placeholder-poster.jpg'
                  }
                  alt={tvShow.name}
                  onError={(e) => { e.target.src = '/placeholder-poster.jpg'; }}
                />
              </div>
              <div className="movie-detail-info">
                <h1 className="movie-detail-title">{tvShow.name}</h1>
                <div className="movie-detail-meta">
                  <span className="movie-detail-year">
                    {tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'N/A'}
                  </span>
                  <span className="movie-detail-rating">
                    ⭐ {tvShow.vote_average?.toFixed(1)}/10
                  </span>
                  <span className="tv-status">
                    {tvShow.status}
                  </span>
                </div>
                <div className="movie-detail-genres">
                  {tvShow.genres?.map(genre => (
                    <button 
                      key={genre.id} 
                      className="genre-tag clickable"
                      onClick={() => navigate(`/genre/${genre.id}`))
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="movie-detail-content">
            {/* Overview */}
            <div className="movie-detail-section">
              <h3>Overview</h3>
              <p className="movie-detail-overview">
                {tvShow.overview || 'No overview available.'}
              </p>
            </div>

            {/* TV Show Specific Info */}
            <div className="movie-detail-section">
              <h3>TV Show Information</h3>
              <div className="tv-info-grid">
                <div className="info-item">
                  <strong>Seasons:</strong>
                  <div>{tvShow.number_of_seasons || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <strong>Episodes:</strong>
                  <div>{tvShow.number_of_episodes || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <strong>First Air Date:</strong>
                  <div>{formatDate(tvShow.first_air_date)}</div>
                </div>
                <div className="info-item">
                  <strong>Last Air Date:</strong>
                  <div>{formatDate(tvShow.last_air_date)}</div>
                </div>
                <div className="info-item">
                  <strong>Status:</strong>
                  <div>{tvShow.status || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <strong>Episode Runtime:</strong>
                  <div>{tvShow.episode_run_time?.length > 0 ? `${tvShow.episode_run_time[0]} min` : 'N/A'}</div>
                </div>
                <div className="info-item">
                  <strong>Networks:</strong>
                  <div className="networks">
                    {tvShow.networks?.map((network, index) => (
                      <span key={network.id} className="network-tag">
                        {network.name}
                      </span>
                    )) || 'N/A'}
                  </div>
                </div>
                <div className="info-item">
                  <strong>Production:</strong>
                  <div className="production-companies">
                    {tvShow.production_companies?.map((company, index) => (
                      <button 
                        key={company.id}
                        className="company-tag clickable"
                        onClick={() => navigate(`/company/${company.id}`))
                        title={`See more shows by ${company.name}`}
                      >
                        {company.name}
                      </button>
                    )) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Seasons */}
            {tvShow.seasons && tvShow.seasons.length > 0 && (
              <div className="movie-detail-section">
                <h3>Seasons</h3>
                <div className="seasons-list">
                  {tvShow.seasons.map(season => (
                    <div key={season.id} className="season-item">
                      <div className="season-poster">
                        <img 
                          src={season.poster_path 
                            ? `https://image.tmdb.org/t/p/w154${season.poster_path}`
                            : '/placeholder-poster.jpg'
                          }
                          alt={season.name}
                          onError={(e) => { e.target.src = '/placeholder-poster.jpg'; }}
                        />
                      </div>
                      <div className="season-info">
                        <h4 className="season-name">{season.name}</h4>
                        <div className="season-meta">
                          <span className="season-episodes">{season.episode_count} episodes</span>
                          {season.air_date && (
                            <span className="season-year">
                              ({new Date(season.air_date).getFullYear()})
                            </span>
                          )}
                        </div>
                        {season.overview && (
                          <p className="season-overview">
                            {season.overview.length > 150 
                              ? `${season.overview.substring(0, 150)}...`
                              : season.overview}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {tvShow.credits?.cast && tvShow.credits.cast.length > 0 && (
              <div className="movie-detail-section">
                <h3>Cast</h3>
                <div className="cast-list">
                  {tvShow.credits.cast.slice(0, 12).map(person => (
                    <div key={person.id} className="cast-member" onClick={() => navigate(`/cast/${person.id}`))>
                      <img 
                        src={person.profile_path 
                          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                          : '/placeholder-person.jpg'
                        }
                        alt={person.name}
                        onError={(e) => { e.target.src = '/placeholder-person.jpg'; }}
                      />
                      <div className="cast-name">{person.name}</div>
                      <div className="cast-character">{person.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {trailerVideo && (
              <div className="movie-detail-section">
                <h3>Trailer</h3>
                <div className="trailer-preview" onClick={handleTrailerClick}>
                  <img 
                    src={`https://img.youtube.com/vi/${trailerVideo.key}/maxresdefault.jpg`}
                    alt="Trailer Thumbnail"
                    className="trailer-thumbnail"
                  />
                  <div className="trailer-play-overlay">
                    <button className="trailer-play-btn">▶</button>
                    <span className="trailer-play-text">Watch Trailer</span>
                  </div>
                </div>
              </div>
            )}

            {/* Watch Providers */}
            <WatchProviders 
              contentId={tvId}
              contentType="tv"
              region="US"
              title={tvShow.name}
            />

            {/* Content Ratings */}
            <ContentRatings 
              contentId={tvId}
              contentType="tv"
            />
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerVideo && (
        <div className="trailer-modal-overlay" onClick={handleCloseTrailer}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close-btn" onClick={handleCloseTrailer}>×</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
              title="TV Show Trailer"
              frameBorder="0"
              allowFullScreen
              allow="autoplay"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default TVDetail;