import { getImageUrl, formatRating } from '../../utils/helpers';

const MovieCard = ({ movie, onClick, showRating = true }) => {
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  
  return (
    <div className="movie-card group cursor-pointer" onClick={() => onClick?.(movie.id)}>
      <div className="movie-poster-container">
        <img
          src={getImageUrl(movie.poster_path, 'poster') || '/placeholder-poster.jpg'}
          alt={title}
          className="movie-poster"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = '/placeholder-poster.jpg'; }}
        />
        <div className="movie-overlay">
          <div className="movie-overlay-content">
            <h3 className="movie-title">{title}</h3>
            {showRating && (
              <div className="movie-rating">
                <span className="rating-star">⭐</span>
                <span>{formatRating(movie.vote_average)}</span>
              </div>
            )}
            {releaseDate && (
              <div className="movie-year">
                {new Date(releaseDate).getFullYear()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;