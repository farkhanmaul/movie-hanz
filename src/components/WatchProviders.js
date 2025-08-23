import React, { useState, useEffect } from 'react';
import { getMovieWatchProviders, getTVWatchProviders } from '../api';

const WatchProviders = ({ contentId, contentType, region = 'US' }) => {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(region);

  const supportedRegions = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  ];

  useEffect(() => {
    if (contentId) {
      loadWatchProviders();
    }
  }, [contentId, contentType, selectedRegion]);

  const loadWatchProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = contentType === 'movie' 
        ? await getMovieWatchProviders(contentId, selectedRegion)
        : await getTVWatchProviders(contentId, selectedRegion);
      
      setProviders(data.results?.[selectedRegion] || null);
    } catch (err) {
      setError('Failed to load watch providers');
      console.error('Error loading watch providers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProviderTypeLabel = (type) => {
    switch (type) {
      case 'flatrate': return 'Stream';
      case 'rent': return 'Rent';
      case 'buy': return 'Buy';
      default: return type;
    }
  };

  const getProviderTypeIcon = (type) => {
    switch (type) {
      case 'flatrate': return '📺';
      case 'rent': return '💰';
      case 'buy': return '🛒';
      default: return '📱';
    }
  };

  const renderProviderSection = (providerList, type) => {
    if (!providerList || providerList.length === 0) return null;

    return (
      <div className="provider-section">
        <h4 className="provider-type">
          {getProviderTypeIcon(type)} {getProviderTypeLabel(type)}
        </h4>
        <div className="provider-list">
          {providerList.map(provider => (
            <div key={provider.provider_id} className="provider-item">
              <div className="provider-logo">
                <img
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  title={provider.provider_name}
                />
              </div>
              <span className="provider-name">{provider.provider_name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="watch-providers-section">
        <h3>Where to Watch</h3>
        <div className="loading-small">Loading streaming options...</div>
      </div>
    );
  }

  return (
    <div className="watch-providers-section">
      <div className="watch-providers-header">
        <h3>Where to Watch</h3>
        <div className="region-selector">
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
          >
            {supportedRegions.map(region => (
              <option key={region.code} value={region.code}>
                {region.flag} {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="watch-providers-error">
          <p>{error}</p>
          <button onClick={loadWatchProviders} className="retry-button">
            Try Again
          </button>
        </div>
      ) : providers ? (
        <div className="watch-providers-content">
          {providers.link && (
            <div className="provider-attribution">
              <p>
                <a 
                  href={providers.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="tmdb-link"
                >
                  View on JustWatch →
                </a>
              </p>
            </div>
          )}

          <div className="providers-grid">
            {renderProviderSection(providers.flatrate, 'flatrate')}
            {renderProviderSection(providers.rent, 'rent')}
            {renderProviderSection(providers.buy, 'buy')}
          </div>

          {!providers.flatrate && !providers.rent && !providers.buy && (
            <div className="no-providers">
              <p>No streaming options available in {supportedRegions.find(r => r.code === selectedRegion)?.name}.</p>
              <p className="suggestion">Try selecting a different region or check back later.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="no-providers">
          <p>No streaming information available for this {contentType} in {supportedRegions.find(r => r.code === selectedRegion)?.name}.</p>
          <p className="suggestion">Try selecting a different region.</p>
        </div>
      )}
    </div>
  );
};

export default WatchProviders;