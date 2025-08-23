import React, { useState, useEffect } from 'react';
import { getMovieGenres, getTVGenres } from '../api';

const AdvancedFilters = ({ onFiltersChange, contentType = 'movie', initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    genres: [],
    genreLogic: 'AND', // AND or OR
    year: { min: 1900, max: new Date().getFullYear() },
    runtime: { min: 0, max: 300 },
    voteAverage: { min: 0, max: 10 },
    voteCount: { min: 0, max: 10000 },
    originalLanguage: '',
    sortBy: 'popularity.desc',
    certification: '',
    keywords: '',
    companies: '',
    cast: '',
    crew: '',
    region: 'US',
    ...initialFilters
  });

  const [genres, setGenres] = useState([]);
  const [expanded, setExpanded] = useState({
    basic: true,
    advanced: false,
    content: false,
    people: false
  });

  const languages = [
    { code: '', name: 'Any Language' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'id', name: 'Indonesian' }
  ];

  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularity (High to Low)' },
    { value: 'popularity.asc', label: 'Popularity (Low to High)' },
    { value: 'vote_average.desc', label: 'Rating (High to Low)' },
    { value: 'vote_average.asc', label: 'Rating (Low to High)' },
    { value: 'vote_count.desc', label: 'Most Voted' },
    { value: 'vote_count.asc', label: 'Least Voted' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'revenue.desc', label: 'Highest Revenue' },
    { value: 'revenue.asc', label: 'Lowest Revenue' },
    { value: 'runtime.desc', label: 'Longest Runtime' },
    { value: 'runtime.asc', label: 'Shortest Runtime' }
  ];

  const certifications = contentType === 'movie' ? [
    { value: '', label: 'Any Rating' },
    { value: 'G', label: 'G - General Audiences' },
    { value: 'PG', label: 'PG - Parental Guidance' },
    { value: 'PG-13', label: 'PG-13 - Parents Strongly Cautioned' },
    { value: 'R', label: 'R - Restricted' },
    { value: 'NC-17', label: 'NC-17 - Adults Only' }
  ] : [
    { value: '', label: 'Any Rating' },
    { value: 'TV-Y', label: 'TV-Y - All Children' },
    { value: 'TV-Y7', label: 'TV-Y7 - Ages 7+' },
    { value: 'TV-G', label: 'TV-G - General Audience' },
    { value: 'TV-PG', label: 'TV-PG - Parental Guidance' },
    { value: 'TV-14', label: 'TV-14 - Ages 14+' },
    { value: 'TV-MA', label: 'TV-MA - Mature Audiences' }
  ];

  useEffect(() => {
    loadGenres();
  }, [contentType]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const loadGenres = async () => {
    try {
      const genreList = contentType === 'movie' ? await getMovieGenres() : await getTVGenres();
      setGenres(genreList);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateRangeFilter = (key, subKey, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: parseInt(value) || 0
      }
    }));
  };

  const toggleGenre = (genreId) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId]
    }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      genres: [],
      genreLogic: 'AND',
      year: { min: 1900, max: new Date().getFullYear() },
      runtime: { min: 0, max: 300 },
      voteAverage: { min: 0, max: 10 },
      voteCount: { min: 0, max: 10000 },
      originalLanguage: '',
      sortBy: 'popularity.desc',
      certification: '',
      keywords: '',
      companies: '',
      cast: '',
      crew: '',
      region: 'US'
    };
    setFilters(defaultFilters);
  };

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getSelectedGenreNames = () => {
    return genres
      .filter(genre => filters.genres.includes(genre.id))
      .map(genre => genre.name)
      .join(filters.genreLogic === 'AND' ? ' + ' : ' | ');
  };

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <h3>Advanced Filters</h3>
        <button onClick={resetFilters} className="reset-button">
          Reset All
        </button>
      </div>

      {/* Basic Filters */}
      <div className="filter-section">
        <button 
          className="section-toggle"
          onClick={() => toggleSection('basic')}
        >
          <span>Basic Filters</span>
          <span className={`toggle-icon ${expanded.basic ? 'expanded' : ''}`}>▼</span>
        </button>
        
        {expanded.basic && (
          <div className="filter-content">
            {/* Sort By */}
            <div className="filter-group">
              <label>Sort By</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Range */}
            <div className="filter-group">
              <label>Release Year</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.year.min}
                  onChange={(e) => updateRangeFilter('year', 'min', e.target.value)}
                  className="range-input"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filters.year.max}
                  onChange={(e) => updateRangeFilter('year', 'max', e.target.value)}
                  className="range-input"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            {/* Rating Range */}
            <div className="filter-group">
              <label>Rating ({filters.voteAverage.min} - {filters.voteAverage.max})</label>
              <div className="range-inputs">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.voteAverage.min}
                  onChange={(e) => updateRangeFilter('voteAverage', 'min', e.target.value)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={filters.voteAverage.max}
                  onChange={(e) => updateRangeFilter('voteAverage', 'max', e.target.value)}
                  className="range-slider"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Genres */}
      <div className="filter-section">
        <button 
          className="section-toggle"
          onClick={() => toggleSection('genres')}
        >
          <span>Genres ({filters.genres.length} selected)</span>
          <span className={`toggle-icon ${expanded.genres ? 'expanded' : ''}`}>▼</span>
        </button>
        
        {expanded.genres && (
          <div className="filter-content">
            <div className="genre-logic-toggle">
              <button
                className={`logic-button ${filters.genreLogic === 'AND' ? 'active' : ''}`}
                onClick={() => updateFilter('genreLogic', 'AND')}
              >
                AND (All selected)
              </button>
              <button
                className={`logic-button ${filters.genreLogic === 'OR' ? 'active' : ''}`}
                onClick={() => updateFilter('genreLogic', 'OR')}
              >
                OR (Any selected)
              </button>
            </div>
            
            {filters.genres.length > 0 && (
              <div className="selected-genres">
                <span>Selected: {getSelectedGenreNames()}</span>
              </div>
            )}
            
            <div className="genre-grid">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  className={`genre-chip ${filters.genres.includes(genre.id) ? 'selected' : ''}`}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="filter-section">
        <button 
          className="section-toggle"
          onClick={() => toggleSection('advanced')}
        >
          <span>Advanced</span>
          <span className={`toggle-icon ${expanded.advanced ? 'expanded' : ''}`}>▼</span>
        </button>
        
        {expanded.advanced && (
          <div className="filter-content">
            {/* Runtime Range */}
            <div className="filter-group">
              <label>Runtime (minutes): {filters.runtime.min} - {filters.runtime.max}</label>
              <div className="range-inputs">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={filters.runtime.min}
                  onChange={(e) => updateRangeFilter('runtime', 'min', e.target.value)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={filters.runtime.max}
                  onChange={(e) => updateRangeFilter('runtime', 'max', e.target.value)}
                  className="range-slider"
                />
              </div>
            </div>

            {/* Vote Count */}
            <div className="filter-group">
              <label>Minimum Votes: {filters.voteCount.min}</label>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={filters.voteCount.min}
                onChange={(e) => updateRangeFilter('voteCount', 'min', e.target.value)}
                className="range-slider"
              />
            </div>

            {/* Original Language */}
            <div className="filter-group">
              <label>Original Language</label>
              <select 
                value={filters.originalLanguage}
                onChange={(e) => updateFilter('originalLanguage', e.target.value)}
                className="filter-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Certification */}
            <div className="filter-group">
              <label>Content Rating</label>
              <select 
                value={filters.certification}
                onChange={(e) => updateFilter('certification', e.target.value)}
                className="filter-select"
              >
                {certifications.map(cert => (
                  <option key={cert.value} value={cert.value}>
                    {cert.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content Filters */}
      <div className="filter-section">
        <button 
          className="section-toggle"
          onClick={() => toggleSection('content')}
        >
          <span>Content</span>
          <span className={`toggle-icon ${expanded.content ? 'expanded' : ''}`}>▼</span>
        </button>
        
        {expanded.content && (
          <div className="filter-content">
            {/* Keywords */}
            <div className="filter-group">
              <label>Keywords</label>
              <input
                type="text"
                placeholder="e.g. superhero, romance, action"
                value={filters.keywords}
                onChange={(e) => updateFilter('keywords', e.target.value)}
                className="filter-input"
              />
              <small>Separate multiple keywords with commas</small>
            </div>

            {/* Companies */}
            <div className="filter-group">
              <label>Production Companies</label>
              <input
                type="text"
                placeholder="e.g. Marvel Studios, Warner Bros"
                value={filters.companies}
                onChange={(e) => updateFilter('companies', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* People Filters */}
      <div className="filter-section">
        <button 
          className="section-toggle"
          onClick={() => toggleSection('people')}
        >
          <span>People</span>
          <span className={`toggle-icon ${expanded.people ? 'expanded' : ''}`}>▼</span>
        </button>
        
        {expanded.people && (
          <div className="filter-content">
            {/* Cast */}
            <div className="filter-group">
              <label>Cast Members</label>
              <input
                type="text"
                placeholder="e.g. Robert Downey Jr., Scarlett Johansson"
                value={filters.cast}
                onChange={(e) => updateFilter('cast', e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Crew */}
            <div className="filter-group">
              <label>Director/Crew</label>
              <input
                type="text"
                placeholder="e.g. Christopher Nolan, Russo Brothers"
                value={filters.crew}
                onChange={(e) => updateFilter('crew', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Applied Filters Summary */}
      <div className="filters-summary">
        <h4>Active Filters:</h4>
        <div className="active-filters">
          {filters.genres.length > 0 && (
            <span className="filter-tag">
              Genres: {getSelectedGenreNames()}
            </span>
          )}
          {filters.year.min > 1900 || filters.year.max < new Date().getFullYear() && (
            <span className="filter-tag">
              Year: {filters.year.min}-{filters.year.max}
            </span>
          )}
          {filters.voteAverage.min > 0 && (
            <span className="filter-tag">
              Rating: ≥{filters.voteAverage.min}
            </span>
          )}
          {filters.originalLanguage && (
            <span className="filter-tag">
              Language: {languages.find(l => l.code === filters.originalLanguage)?.name}
            </span>
          )}
          {filters.certification && (
            <span className="filter-tag">
              Rating: {filters.certification}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;