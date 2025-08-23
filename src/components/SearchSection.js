import React, { useState, useEffect, useCallback } from 'react';
import { searchMulti, searchMovie, searchTV, searchPerson } from '../api';

const SearchSection = ({ onMovieClick, onTVClick, onPersonClick, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('multi');
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = useCallback(async () => {
    if (query.length <= 2) return;
    
    setLoading(true);
    try {
      let response;
      switch (searchType) {
        case 'movie':
          response = await searchMovie(query);
          break;
        case 'tv':
          response = await searchTV(query);
          break;
        case 'person':
          response = await searchPerson(query);
          break;
        default:
          response = await searchMulti(query);
      }
      setResults(response.results || []);
      setTotalResults(response.total_results || 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, searchType]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.length > 2) {
      handleSearch();
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.length > 2) {
      handleSearch();
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    // Auto-search if there's a query
    if (query.length > 2) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
  };

  const getMediaType = (item) => {
    if (item.media_type) return item.media_type;
    if (item.title) return 'movie';
    if (item.name && item.first_air_date) return 'tv';
    if (item.known_for_department) return 'person';
    return 'unknown';
  };

  const getTitle = (item) => {
    return item.title || item.name;
  };

  const getDate = (item) => {
    return item.release_date || item.first_air_date;
  };

  const getImagePath = (item) => {
    const mediaType = getMediaType(item);
    if (mediaType === 'person') {
      return item.profile_path 
        ? `${process.env.REACT_APP_BASEIMGURL}${item.profile_path}`
        : '/placeholder-person.svg';
    }
    return item.poster_path 
      ? `${process.env.REACT_APP_BASEIMGURL}${item.poster_path}`
      : '/placeholder-poster.svg';
  };

  const renderSearchResult = (item) => {
    const mediaType = getMediaType(item);
    const title = getTitle(item);
    const date = getDate(item);

    return (
      <div 
        key={`${item.id}-${mediaType}`} 
        className="search-result-item"
        onClick={() => {
          if (mediaType === 'movie' && onMovieClick) {
            onMovieClick(item.id);
            onClose && onClose();
          } else if (mediaType === 'tv' && onTVClick) {
            onTVClick(item.id);
            onClose && onClose();
          } else if (mediaType === 'person' && onPersonClick) {
            onPersonClick(item.id);
            onClose && onClose();
          }
        }}
      >
        <img
          src={getImagePath(item)}
          alt={title}
          className="search-result-image"
          onError={(e) => {
            e.target.src = mediaType === 'person' 
              ? '/placeholder-person.svg' 
              : '/placeholder-poster.svg';
          }}
        />
        <div className="search-result-info">
          <div className="search-result-header">
            <h3 className="search-result-title">{title}</h3>
            <span className="search-result-type">
              {mediaType === 'movie' && '🎬'}
              {mediaType === 'tv' && '📺'}
              {mediaType === 'person' && '👤'}
            </span>
          </div>
          
          {date && (
            <p className="search-result-date">{date}</p>
          )}
          
          {item.vote_average > 0 && (
            <div className="search-result-rating">
              ⭐ {item.vote_average.toFixed(1)}
            </div>
          )}
          
          {mediaType === 'person' && item.known_for_department && (
            <p className="search-result-department">
              {item.known_for_department}
            </p>
          )}
          
          {item.overview && (
            <p className="search-result-overview">
              {item.overview.length > 200
                ? `${item.overview.substring(0, 200)}...`
                : item.overview}
            </p>
          )}
          
          {mediaType === 'person' && item.known_for && (
            <div className="search-result-known-for">
              <strong>Known for:</strong>
              <div className="known-for-list">
                {item.known_for.slice(0, 3).map((work, index) => (
                  <span key={work.id} className="known-for-item">
                    {work.title || work.name}
                    {index < item.known_for.slice(0, 3).length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="search-close-btn" onClick={onClose}>×</button>
        <div className="section">
          <h2 className="section-title">Search Movies, TV Shows & People</h2>
      
      <form onSubmit={handleFormSubmit} className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type and press Enter to search..."
          className="search-input"
        />
        <button type="submit" className="search-submit-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="search-icon">
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Search
        </button>
      </form>
        
      <div className="search-toggle-tabs">
        <button
          className={searchType === 'multi' ? 'search-tab-button active' : 'search-tab-button'}
          onClick={() => handleSearchTypeChange('multi')}
        >
          <span className="tab-icon">🔍</span>
          <span className="tab-text">All</span>
        </button>
        <button
          className={searchType === 'movie' ? 'search-tab-button active' : 'search-tab-button'}
          onClick={() => handleSearchTypeChange('movie')}
        >
          <span className="tab-icon">🎬</span>
          <span className="tab-text">Movies</span>
        </button>
        <button
          className={searchType === 'tv' ? 'search-tab-button active' : 'search-tab-button'}
          onClick={() => handleSearchTypeChange('tv')}
        >
          <span className="tab-icon">📺</span>
          <span className="tab-text">TV Shows</span>
        </button>
        <button
          className={searchType === 'person' ? 'search-tab-button active' : 'search-tab-button'}
          onClick={() => handleSearchTypeChange('person')}
        >
          <span className="tab-icon">👤</span>
          <span className="tab-text">People</span>
        </button>
      </div>

      {loading && <div className="loading">Searching...</div>}
      
      {!loading && query.length > 2 && (
        <div className="section-subtitle">
          Found {totalResults} results for "{query}"
        </div>
      )}

      <div className="search-results">
        {results.map(renderSearchResult)}
      </div>
      
      {!loading && query.length > 2 && results.length === 0 && (
        <div className="no-results">
          <p>No results found for "{query}". Try different keywords.</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;