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
          🔍 Search
        </button>
      </form>
        
      <div className="control-tabs">
        <button
          className={searchType === 'multi' ? 'tab-button active' : 'tab-button'}
          onClick={() => setSearchType('multi')}
        >
          All
        </button>
        <button
          className={searchType === 'movie' ? 'tab-button active' : 'tab-button'}
          onClick={() => setSearchType('movie')}
        >
          Movies
        </button>
        <button
          className={searchType === 'tv' ? 'tab-button active' : 'tab-button'}
          onClick={() => setSearchType('tv')}
        >
          TV Shows
        </button>
        <button
          className={searchType === 'person' ? 'tab-button active' : 'tab-button'}
          onClick={() => setSearchType('person')}
        >
          People
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