import React, { useState, useEffect } from 'react';
import { getSeasonDetails } from '../api';
import ImageGallery from './ui/ImageGallery';

const SeasonDetails = ({ tvId, season, onEpisodeClick, onClose }) => {
  const [seasonData, setSeasonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('episodes');

  useEffect(() => {
    if (tvId && season) {
      loadSeasonDetails();
    }
  }, [tvId, season]);

  const loadSeasonDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSeasonDetails(tvId, season.season_number);
      setSeasonData(data);
    } catch (err) {
      setError('Failed to load season details');
      console.error('Error fetching season details:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (runtime) => {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="season-detail-overlay">
        <div className="season-detail-container">
          <div className="loading">Loading season details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="season-detail-overlay">
        <div className="season-detail-container">
          <div className="error-state">
            <h2>Error Loading Season</h2>
            <p>{error}</p>
            <button onClick={loadSeasonDetails} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!seasonData) return null;

  const tabs = [
    { key: 'episodes', label: 'Episodes', count: seasonData.episodes?.length || 0 },
    { key: 'cast', label: 'Cast', count: seasonData.credits?.cast?.length || 0 },
    { key: 'images', label: 'Images', count: seasonData.images?.stills?.length || 0 }
  ];

  return (
    <div className="season-detail-overlay">
      <div className="season-detail-container scrollable-container">
        <button className="close-button" onClick={onClose}>×</button>
        
        {/* Header */}
        <div 
          className="season-detail-header"
          style={{
            backgroundImage: seasonData.poster_path 
              ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/original${seasonData.poster_path})`
              : 'none'
          }}
        >
          <div className="season-detail-header-content">
            <div className="season-detail-poster">
              <img 
                src={seasonData.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${seasonData.poster_path}`
                  : '/placeholder-poster.svg'
                }
                alt={seasonData.name}
                onError={(e) => { e.target.src = '/placeholder-poster.svg'; }}
              />
            </div>
            <div className="season-detail-info">
              <h1 className="season-detail-title">{seasonData.name}</h1>
              <div className="season-detail-meta">
                <span className="season-number">Season {seasonData.season_number}</span>
                <span className="episode-count">{seasonData.episodes?.length || 0} Episodes</span>
                <span className="air-date">
                  {formatDate(seasonData.air_date)}
                </span>
                {seasonData.vote_average > 0 && (
                  <span className="season-rating">
                    ⭐ {seasonData.vote_average.toFixed(1)}/10
                  </span>
                )}
              </div>
              {seasonData.overview && (
                <p className="season-overview">{seasonData.overview}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="season-detail-tabs">
          {tabs.map(tab => (
            tab.count > 0 && (
              <button
                key={tab.key}
                className={`season-tab ${selectedTab === tab.key ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab.key)}
              >
                {tab.label} ({tab.count})
              </button>
            )
          ))}
        </div>

        {/* Content */}
        <div className="season-detail-content">
          
          {/* Episodes Tab */}
          {selectedTab === 'episodes' && seasonData.episodes && (
            <div className="season-episodes">
              {seasonData.episodes.map((episode, index) => (
                <div 
                  key={episode.id} 
                  className="episode-card"
                  onClick={() => onEpisodeClick && onEpisodeClick(episode, seasonData.season_number)}
                >
                  <div className="episode-poster">
                    <img 
                      src={episode.still_path 
                        ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                        : '/placeholder-backdrop.svg'
                      }
                      alt={episode.name}
                      onError={(e) => { e.target.src = '/placeholder-backdrop.svg'; }}
                    />
                    <div className="episode-number">{episode.episode_number}</div>
                  </div>
                  <div className="episode-info">
                    <div className="episode-header">
                      <h3 className="episode-title">{episode.name}</h3>
                      <div className="episode-meta">
                        <span className="episode-date">{formatDate(episode.air_date)}</span>
                        <span className="episode-runtime">{formatRuntime(episode.runtime)}</span>
                        {episode.vote_average > 0 && (
                          <span className="episode-rating">
                            ⭐ {episode.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    {episode.overview && (
                      <p className="episode-overview">
                        {episode.overview.length > 250 
                          ? `${episode.overview.substring(0, 250)}...`
                          : episode.overview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cast Tab */}
          {selectedTab === 'cast' && seasonData.credits?.cast && (
            <div className="season-cast">
              <div className="cast-list">
                {seasonData.credits.cast.slice(0, 20).map(person => (
                  <div key={person.id} className="cast-member">
                    <img 
                      src={person.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : '/placeholder-person.svg'
                      }
                      alt={person.name}
                      onError={(e) => { e.target.src = '/placeholder-person.svg'; }}
                    />
                    <div className="cast-name">{person.name}</div>
                    <div className="cast-character">{person.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Images Tab */}
          {selectedTab === 'images' && seasonData.images && (
            <ImageGallery
              images={seasonData.images.posters || []}
              title="Season Images"
              type="mixed"
              showTabs={false}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default SeasonDetails;