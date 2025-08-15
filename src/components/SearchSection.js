import React, { useState, useEffect } from 'react';
import { searchMulti, searchMovie, searchTV, searchPerson } from '../api';

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('multi');
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (query.length > 2) {
      const delaySearch = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      setResults([]);
      setTotalResults(0);
    }
  }, [query, searchType]);

  const handleSearch = async () => {
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
        : '/placeholder-person.jpg';
    }
    return item.poster_path 
      ? `${process.env.REACT_APP_BASEIMGURL}${item.poster_path}`
      : '/placeholder-poster.jpg';
  };

  const renderSearchResult = (item) => {
    const mediaType = getMediaType(item);
    const title = getTitle(item);
    const date = getDate(item);

    return (
      <div key={`${item.id}-${mediaType}`} className="search-result-item">
        <img
          src={getImagePath(item)}
          alt={title}
          className="search-result-image"
          onError={(e) => {
            e.target.src = mediaType === 'person' 
              ? '/placeholder-person.jpg' 
              : '/placeholder-poster.jpg';
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
    <div className="search-section">
      <h2>🔍 Search Movies, TV Shows & People</h2>
      
      <div className="search-controls">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows, or people..."
          className="search-input"
        />
        
        <div className="search-type-selector">
          <button
            className={searchType === 'multi' ? 'active' : ''}
            onClick={() => setSearchType('multi')}
          >
            All
          </button>
          <button
            className={searchType === 'movie' ? 'active' : ''}
            onClick={() => setSearchType('movie')}
          >
            Movies
          </button>
          <button
            className={searchType === 'tv' ? 'active' : ''}
            onClick={() => setSearchType('tv')}
          >
            TV Shows
          </button>
          <button
            className={searchType === 'person' ? 'active' : ''}
            onClick={() => setSearchType('person')}
          >
            People
          </button>
        </div>
      </div>

      {loading && <div className="loading">Searching...</div>}
      
      {!loading && query.length > 2 && (
        <div className="search-results-header">
          <p>Found {totalResults} results for "{query}"</p>
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
  );
};

export default SearchSection;