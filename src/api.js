import axios from "axios";

const { REACT_APP_API_KEY: apiKey, REACT_APP_BASEURL: baseURL } = process.env;

// Simple cache for API responses (5 minutes TTL)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const createApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${baseURL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
};

const apiRequest = async (endpoint, params = {}) => {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await axios.get(createApiUrl(endpoint, params));
  cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
  return response.data;
};

export const getMovieList = (page = 1) => apiRequest('/movie/popular', { page });
export const searchMovie = (q) => apiRequest('/search/movie', { query: q, page: 1 });
export const searchMulti = (q) => apiRequest('/search/multi', { query: q, page: 1 });
export const searchTV = (q) => apiRequest('/search/tv', { query: q, page: 1 });
export const searchPerson = (q) => apiRequest('/search/person', { query: q, page: 1 });

export const getTrendingMovies = (timeWindow = 'day', page = 1) => 
  apiRequest(`/trending/movie/${timeWindow}`, { page });

export const getTrendingTV = (timeWindow = 'day', page = 1) => 
  apiRequest(`/trending/tv/${timeWindow}`, { page });

export const getTrendingAll = (timeWindow = 'day') => 
  apiRequest(`/trending/all/${timeWindow}`).then(data => data.results);

export const getTopMoviesThisMonth = async () => {
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  return apiRequest('/discover/movie', {
    sort_by: 'vote_average.desc',
    'vote_count.gte': 1000,
    'primary_release_date.gte': lastMonth.toISOString().split('T')[0],
    'primary_release_date.lte': thisMonth.toISOString().split('T')[0]
  }).then(data => data.results);
};

export const getMovieDetails = (movieId) => 
  apiRequest(`/movie/${movieId}`, { append_to_response: 'credits,videos,similar' });

export const getTVDetails = (tvId) => 
  apiRequest(`/tv/${tvId}`, { append_to_response: 'credits,videos,similar' });

export const getPersonDetails = (personId) => 
  apiRequest(`/person/${personId}`, { append_to_response: 'movie_credits,tv_credits' });

export const getCompanyDetails = (companyId) => 
  apiRequest(`/company/${companyId}`);

export const getNowPlayingMovies = (page = 1) => apiRequest('/movie/now_playing', { page });
export const getUpcomingMovies = (page = 1) => apiRequest('/movie/upcoming', { page });

export const getTopRatedMovies = (page = 1, year = '') => 
  apiRequest('/movie/top_rated', { page, primary_release_year: year });

export const getTopRatedTV = (page = 1, year = '') => 
  apiRequest('/tv/top_rated', { page, first_air_date_year: year });

export const getPopularTV = (page = 1) => 
  apiRequest('/tv/popular', { page });

export const getMovieGenres = () => 
  apiRequest('/genre/movie/list').then(data => data.genres);

export const getTVGenres = () => 
  apiRequest('/genre/tv/list').then(data => data.genres);

export const discoverMoviesByGenre = (genreId, page = 1) => 
  apiRequest('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' });

export const discoverTVByGenre = (genreId, page = 1) => 
  apiRequest('/discover/tv', { with_genres: genreId, page, sort_by: 'popularity.desc' });

export const getMovieRecommendations = (movieId) => 
  apiRequest(`/movie/${movieId}/recommendations`).then(data => data.results);

export const getTVRecommendations = (tvId) => 
  apiRequest(`/tv/${tvId}/recommendations`).then(data => data.results);

export const getSimilarMovies = (movieId) => 
  apiRequest(`/movie/${movieId}/similar`).then(data => data.results);

export const getSimilarTV = (tvId) => 
  apiRequest(`/tv/${tvId}/similar`).then(data => data.results);

export const getMovieVideos = (movieId) => 
  apiRequest(`/movie/${movieId}/videos`).then(data => data.results);

export const getMovieCredits = (movieId) => apiRequest(`/movie/${movieId}/credits`);

export const getMovieReviews = (movieId) => 
  apiRequest(`/movie/${movieId}/reviews`).then(data => data.results);

export const getMovieKeywords = (movieId) => 
  apiRequest(`/movie/${movieId}/keywords`).then(data => data.keywords);

export const getMovieCollection = (collectionId) => apiRequest(`/collection/${collectionId}`);

export const getMovieWatchProviders = (movieId, region = 'US') => 
  apiRequest(`/movie/${movieId}/watch/providers`);

export const getTVWatchProviders = (tvId, region = 'US') => 
  apiRequest(`/tv/${tvId}/watch/providers`);

export const getMovieReleaseDates = (movieId) => 
  apiRequest(`/movie/${movieId}/release_dates`);

export const getTVContentRatings = (tvId) => 
  apiRequest(`/tv/${tvId}/content_ratings`);

export const discoverMoviesAdvanced = ({ genre, year, sortBy = 'popularity.desc', page = 1, minRating = 0, maxRating = 10, region = '' }) => {
  const params = { page, sort_by: sortBy };
  if (genre) params.with_genres = genre;
  if (year) params.primary_release_year = year;
  if (minRating > 0) params['vote_average.gte'] = minRating;
  if (maxRating < 10) params['vote_average.lte'] = maxRating;
  if (region) params.region = region;
  return apiRequest('/discover/movie', params);
};

export const discoverMoviesByCast = (personId, page = 1) => 
  apiRequest('/discover/movie', { with_cast: personId, page, sort_by: 'popularity.desc' });

export const discoverMoviesByCrew = (personId, page = 1) => 
  apiRequest('/discover/movie', { with_crew: personId, page, sort_by: 'popularity.desc' });

export const discoverMoviesByCompany = (companyId, page = 1) => 
  apiRequest('/discover/movie', { with_companies: companyId, page, sort_by: 'popularity.desc' });

export const discoverTVAdvanced = ({ genre, year, sortBy = 'popularity.desc', page = 1, minRating = 0, maxRating = 10 }) => {
  const params = { page, sort_by: sortBy };
  if (genre) params.with_genres = genre;
  if (year) params.first_air_date_year = year;
  if (minRating > 0) params['vote_average.gte'] = minRating;
  if (maxRating < 10) params['vote_average.lte'] = maxRating;
  return apiRequest('/discover/tv', params);
};