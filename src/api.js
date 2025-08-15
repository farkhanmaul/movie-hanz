import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;
const baseURL = process.env.REACT_APP_BASEURL;

// Popular Movies (existing)
export const getMovieList = async () => {
  const movie = await axios.get(
    `${baseURL}/movie/popular?page=1&api_key=${apiKey}`
  );
  return movie.data.results;
};

// Search Movies (existing)
export const searchMovie = async (q) => {
  const search = await axios.get(
    `${baseURL}/search/movie?query=${q}&page=1&api_key=${apiKey}`
  );
  return search.data;
};

// Trending Movies & TV Shows
export const getTrendingMovies = async (timeWindow = 'day') => {
  const response = await axios.get(
    `${baseURL}/trending/movie/${timeWindow}?api_key=${apiKey}`
  );
  return response.data.results;
};

export const getTrendingTV = async (timeWindow = 'day') => {
  const response = await axios.get(
    `${baseURL}/trending/tv/${timeWindow}?api_key=${apiKey}`
  );
  return response.data.results;
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
export const getNowPlayingMovies = async () => {
  const response = await axios.get(
    `${baseURL}/movie/now_playing?page=1&api_key=${apiKey}`
  );
  return response.data.results;
};

export const getUpcomingMovies = async () => {
  const response = await axios.get(
    `${baseURL}/movie/upcoming?page=1&api_key=${apiKey}`
  );
  return response.data.results;
};

// Top Rated
export const getTopRatedMovies = async () => {
  const response = await axios.get(
    `${baseURL}/movie/top_rated?page=1&api_key=${apiKey}`
  );
  return response.data.results;
};

export const getTopRatedTV = async () => {
  const response = await axios.get(
    `${baseURL}/tv/top_rated?page=1&api_key=${apiKey}`
  );
  return response.data.results;
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
