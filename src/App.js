import "./App.css";
import { getMovieList, searchMovie } from "./api.js";
import { useEffect, useState } from "react";
import TrendingSection from "./components/TrendingSection";
import SearchSection from "./components/SearchSection";
import MovieDetail from "./components/MovieDetail";
import NowPlayingUpcoming from "./components/NowPlayingUpcoming";
import TopRatedSection from "./components/TopRatedSection";

const App = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showMovieDetail, setShowMovieDetail] = useState(false);

  useEffect(() => {
    getMovieList().then((result) => {
      setPopularMovies(result);
    });
  }, []);

  const PopularMovieList = () => {
    return popularMovies.map((movie, i) => {
      return (
        <div 
          className="movie-card" 
          key={i}
          onClick={() => handleMovieClick(movie.id)}
        >
          <div className="movie-poster-container">
            <img
              className="Movie-img"
              alt={movie.title}
              src={`${process.env.REACT_APP_BASEIMGURL}/${movie.poster_path}`}
              onError={(e) => {
                e.target.src = '/placeholder-poster.jpg';
              }}
            />
            <div className="movie-overlay">
              <button className="play-button">▶</button>
            </div>
          </div>
          <div className="movie-info">
            <div className="Movie-title">{movie.title}</div>
            <div className="Movie-date">{movie.release_date}</div>
            <div className="Movie-rate">⭐ {movie.vote_average?.toFixed(1)}</div>
          </div>
        </div>
      );
    });
  };

  const search = async (q) => {
    if (q.length > 3) {
      const query = await searchMovie(q);
      setPopularMovies(query.results);
    } else if (q.length === 0) {
      const movies = await getMovieList();
      setPopularMovies(movies);
    }
  };

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
    setShowMovieDetail(true);
  };

  const handleCloseMovieDetail = () => {
    setShowMovieDetail(false);
    setSelectedMovieId(null);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'trending':
        return <TrendingSection />;
      case 'search':
        return <SearchSection />;
      case 'nowplaying':
        return <NowPlayingUpcoming onMovieClick={handleMovieClick} />;
      case 'toprated':
        return <TopRatedSection onMovieClick={handleMovieClick} />;
      default:
        return (
          <div className="section">
            <h2 className="section-title">Popular Movies</h2>
            <div className="search-container">
              <input
                placeholder="Search your favorite movies..."
                className="Movie-search"
                onChange={({ target }) => search(target.value)}
              />
            </div>
            <div className="movie-grid">
              <PopularMovieList />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Fixed Navigation Header */}
        <nav className="header-nav">
          <div className="nav-container">
            <h1>MOVIE</h1>
            
            <div className="app-navigation">
              <button 
                className={currentSection === 'home' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('home')}
              >
                Home
              </button>
              <button 
                className={currentSection === 'trending' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('trending')}
              >
                Trending
              </button>
              <button 
                className={currentSection === 'search' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('search')}
              >
                Search
              </button>
              <button 
                className={currentSection === 'nowplaying' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('nowplaying')}
              >
                In Theaters
              </button>
              <button 
                className={currentSection === 'toprated' ? 'nav-button active' : 'nav-button'}
                onClick={() => setCurrentSection('toprated')}
              >
                Top Rated
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="app-content">
          {renderContent()}
        </div>

        {/* Movie Detail Modal */}
        {showMovieDetail && selectedMovieId && (
          <MovieDetail 
            movieId={selectedMovieId} 
            onClose={handleCloseMovieDetail}
          />
        )}
      </header>
    </div>
  );
};

export default App;
