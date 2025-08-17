import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;
const baseURL = process.env.REACT_APP_BASEURL;

// Popular Movies (existing)
export const getMovieList = async (page = 1) => {
  const movie = await axios.get(
    `${baseURL}/movie/popular?page=${page}&api_key=${apiKey}`
  );
  return movie.data;
};

// Search Movies (existing)
export const searchMovie = async (q) => {
  const search = await axios.get(
    `${baseURL}/search/movie?query=${q}&page=1&api_key=${apiKey}`
  );
  return search.data;
};

// Trending Movies & TV Shows
export const getTrendingMovies = async (timeWindow = 'day', page = 1) => {
  const response = await axios.get(
    `${baseURL}/trending/movie/${timeWindow}?page=${page}&api_key=${apiKey}`
  );
  return response.data;
};

// Top Movies This Month/Year for Hero
export const getTopMoviesThisMonth = async () => {
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const fromDate = lastMonth.toISOString().split('T')[0];
  const toDate = thisMonth.toISOString().split('T')[0];
  
  const response = await axios.get(
    `${baseURL}/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc&vote_count.gte=1000&primary_release_date.gte=${fromDate}&primary_release_date.lte=${toDate}`
  );
  return response.data.results;
};

export const getTrendingTV = async (timeWindow = 'day', page = 1) => {
  const response = await axios.get(
    `${baseURL}/trending/tv/${timeWindow}?page=${page}&api_key=${apiKey}`
  );
  return response.data;
};

export const getTrendingAll = async (timeWindow = 'day') => {
  const response = await axios.get(
    `${baseURL}/trending/all/${timeWindow}?api_key=${apiKey}`
  );
  return response.data.results;
};

// Multi Search (Movie/TV/People)
export const searchMulti = async (q) => {
  const response = await axios.get(
    `${baseURL}/search/multi?query=${q}&page=1&api_key=${apiKey}`
  );
  return response.data;
};

export const searchTV = async (q) => {
  const response = await axios.get(
    `${baseURL}/search/tv?query=${q}&page=1&api_key=${apiKey}`
  );
  return response.data;
};

export const searchPerson = async (q) => {
  const response = await axios.get(
    `${baseURL}/search/person?query=${q}&page=1&api_key=${apiKey}`
  );
  return response.data;
};

// Movie Details
export const getMovieDetails = async (movieId) => {
  const response = await axios.get(
    `${baseURL}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos,similar`
  );
  return response.data;
};

// TV Series Details
export const getTVDetails = async (tvId) => {
  const response = await axios.get(
    `${baseURL}/tv/${tvId}?api_key=${apiKey}&append_to_response=credits,videos,similar`
  );
  return response.data;
};

// Person Details
export const getPersonDetails = async (personId) => {
  const response = await axios.get(
    `${baseURL}/person/${personId}?api_key=${apiKey}&append_to_response=movie_credits,tv_credits`
  );
  return response.data;
};

// Now Playing & Upcoming
export const getNowPlayingMovies = async (page = 1) => {
  const response = await axios.get(
    `${baseURL}/movie/now_playing?page=${page}&api_key=${apiKey}`
  );
  return response.data;
};

export const getUpcomingMovies = async (page = 1) => {
  const response = await axios.get(
    `${baseURL}/movie/upcoming?page=${page}&api_key=${apiKey}`
  );
  return response.data;
};

// Top Rated
export const getTopRatedMovies = async (page = 1) => {
  const response = await axios.get(
    `${baseURL}/movie/top_rated?page=${page}&api_key=${apiKey}`
  );
  return response.data;
};

export const getTopRatedTV = async (page = 1) => {
  const response = await axios.get(
    `${baseURL}/tv/top_rated?page=${page}&api_key=${apiKey}`
  );
  return response.data;
};

// Popular TV
export const getPopularTV = async () => {
  const response = await axios.get(
    `${baseURL}/tv/popular?page=1&api_key=${apiKey}`
  );
  return response.data.results;
};

// Genres
export const getMovieGenres = async () => {
  const response = await axios.get(
    `${baseURL}/genre/movie/list?api_key=${apiKey}`
  );
  return response.data.genres;
};

export const getTVGenres = async () => {
  const response = await axios.get(
    `${baseURL}/genre/tv/list?api_key=${apiKey}`
  );
  return response.data.genres;
};

// Discover Movies by Genre
export const discoverMoviesByGenre = async (genreId, page = 1) => {
  const response = await axios.get(
    `${baseURL}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
  );
  return response.data;
};

// Discover TV by Genre
export const discoverTVByGenre = async (genreId, page = 1) => {
  const response = await axios.get(
    `${baseURL}/discover/tv?api_key=${apiKey}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
  );
  return response.data;
};

// Movie Recommendations
export const getMovieRecommendations = async (movieId) => {
  const response = await axios.get(
    `${baseURL}/movie/${movieId}/recommendations?api_key=${apiKey}`
  );
  return response.data.results;
};

// TV Recommendations
export const getTVRecommendations = async (tvId) => {
  const response = await axios.get(
    `${baseURL}/tv/${tvId}/recommendations?api_key=${apiKey}`
  );
  return response.data.results;
};

// Similar Movies
export const getSimilarMovies = async (movieId) => {
  const response = await axios.get(
    `${baseURL}/movie/${movieId}/similar?api_key=${apiKey}`
  );
  return response.data.results;
};

// Similar TV Shows
export const getSimilarTV = async (tvId) => {
  const response = await axios.get(
    `${baseURL}/tv/${tvId}/similar?api_key=${apiKey}`
  );
  return response.data.results;
};

// Movie Videos (Trailers)
export const getMovieVideos = async (movieId) => {
  const response = await axios.get(
    `${baseURL}/movie/${movieId}/videos?api_key=${apiKey}`
  );
  return response.data.results;
};

// Movie Credits (Cast & Crew)
export const getMovieCredits = async (movieId) => {
  const response = await axios.get(
    `${baseURL}/movie/${movieId}/credits?api_key=${apiKey}`
  );
  return response.data;
};

// Reviews
export const getMovieReviews = async (movieId) => {
  const response = await axios.get(
    `${baseURL}/movie/${movieId}/reviews?api_key=${apiKey}`
  );
  return response.data.results;
};

// Keywords
export const getMovieKeywords = async (movieId) => {
  const response = await axios.get(
    `${baseURL}/movie/${movieId}/keywords?api_key=${apiKey}`
  );
  return response.data.keywords;
};

// Movie Collections
export const getMovieCollection = async (collectionId) => {
  const response = await axios.get(
    `${baseURL}/collection/${collectionId}?api_key=${apiKey}`
  );
  return response.data;
};

// Discover with Filters
export const discoverMoviesAdvanced = async ({
  genre,
  year,
  sortBy = 'popularity.desc',
  page = 1,
  minRating = 0,
  maxRating = 10,
  region = ''
}) => {
  let url = `${baseURL}/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${sortBy}`;
  
  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;
  if (minRating > 0) url += `&vote_average.gte=${minRating}`;
  if (maxRating < 10) url += `&vote_average.lte=${maxRating}`;
  if (region) url += `&region=${region}`;
  
  const response = await axios.get(url);
  return response.data;
};

// Discover Movies by Cast
export const discoverMoviesByCast = async (personId, page = 1) => {
  const response = await axios.get(
    `${baseURL}/discover/movie?api_key=${apiKey}&with_cast=${personId}&page=${page}&sort_by=popularity.desc`
  );
  return response.data;
};

// Discover Movies by Crew (Director, Producer, etc.)
export const discoverMoviesByCrew = async (personId, page = 1) => {
  const response = await axios.get(
    `${baseURL}/discover/movie?api_key=${apiKey}&with_crew=${personId}&page=${page}&sort_by=popularity.desc`
  );
  return response.data;
};

// Discover Movies by Production Company
export const discoverMoviesByCompany = async (companyId, page = 1) => {
  const response = await axios.get(
    `${baseURL}/discover/movie?api_key=${apiKey}&with_companies=${companyId}&page=${page}&sort_by=popularity.desc`
  );
  return response.data;
};
