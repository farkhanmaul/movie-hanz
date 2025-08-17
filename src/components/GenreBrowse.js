import React, { useState, useEffect } from 'react';
import { getMovieGenres, getTVGenres, discoverMoviesByGenre, discoverTVByGenre } from '../api';
import Pagination from './ui/Pagination';

const GenreBrowse = ({ onMovieClick, onTVClick }) => {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTVGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [activeTab, setActiveTab] = useState('movies');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showGenreList, setShowGenreList] = useState(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      fetchContentByGenre(selectedGenre.id, currentPage);
    }
  }, [selectedGenre, activeTab, currentPage]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    setShowGenreList(false);
    setCurrentPage(1);
  };

  const handleBackToGenres = () => {
    setShowGenreList(true);
    setSelectedGenre(null);
  };

  const fetchGenres = async () => {
    try {
      const [movies, tv] = await Promise.all([
        getMovieGenres(),
        getTVGenres()
      ]);
      setMovieGenres(movies);
      setTVGenres(tv);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentByGenre = async (genreId, page = 1) => {
    setLoading(true);
    try {
      let result;
      if (activeTab === 'movies') {
        result = await discoverMoviesByGenre(genreId, page);
      } else {
        result = await discoverTVByGenre(genreId, page);
      }
      
      setContent(result.results || []);
      setTotalPages(Math.min(result.total_pages || 1, 500));
    } catch (error) {
      console.error('Error fetching content by genre:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    
    // Update selected genre for the new tab
    const genres = tab === 'movies' ? movieGenres : tvGenres;
    const matchingGenre = genres.find(g => g.name === selectedGenre?.name) || genres[0];
    setSelectedGenre(matchingGenre);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading content...</div>;
    }

    return content.map((item) => (
      <div 
        key={item.id} 
        className="movie-card"
        onClick={() => {
          if (activeTab === 'movies' && onMovieClick) {
            onMovieClick(item.id);
          } else if (activeTab === 'tv' && onTVClick) {
            onTVClick(item.id);
          }
        }}
      >
        <div className="movie-poster-container">
          <img
            className="movie-poster"
            src={item.poster_path 
              ? `${process.env.REACT_APP_BASEIMGURL}${item.poster_path}`
              : '/placeholder-poster.jpg'
            }
            alt={item.title || item.name}
            onError={(e) => {
              e.target.src = '/placeholder-poster.jpg';
            }}
          />
          <div className="movie-overlay">
            <button className="play-button">▶</button>
          </div>
        </div>
        <div className="movie-info">
          <div className="movie-title">{item.title || item.name}</div>
          <div className="movie-year">
            {new Date(item.release_date || item.first_air_date).getFullYear()}
          </div>
          <div className="movie-rating">
            ⭐ {item.vote_average?.toFixed(1)}
          </div>
        </div>
      </div>
    ));
  };

  const currentGenres = activeTab === 'movies' ? movieGenres : tvGenres;

  if (showGenreList) {
    return (
      <div className="section">
        <h2 className="section-title">Browse by Genre</h2>
        
        {/* Tab Selection */}
        <div className="control-tabs">
          <button
            className={activeTab === 'movies' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('movies')}
          >
            Movies
          </button>
          <button
            className={activeTab === 'tv' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('tv')}
          >
            TV Shows
          </button>
        </div>

        {/* Genre Grid */}
        {loading ? (
          <div className="loading">Loading genres...</div>
        ) : (
          <div className="genre-grid">
            {currentGenres.map((genre) => (
              <div
                key={genre.id}
                className="genre-card"
                onClick={() => handleGenreClick(genre)}
              >
                <h3 className="genre-name">{genre.name}</h3>
                <div className="genre-overlay">
                  <span>Explore →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">{selectedGenre?.name} {activeTab === 'movies' ? 'Movies' : 'TV Shows'}</h2>
        <button className="back-button" onClick={handleBackToGenres}>
          ← Back to Genres
        </button>
      </div>

      {/* Content */}
      <div className="movie-grid">
        {renderContent()}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default GenreBrowse;