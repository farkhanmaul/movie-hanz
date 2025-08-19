// Navigation configuration
export const NAV_ITEMS = [
  { path: '/trending', label: 'Trending' },
  { path: '/nowplaying', label: 'Now Playing' },
  { path: '/toprated', label: 'Top Rated' },
  { path: '/genres', label: 'Genres' },
  { path: '/movies', label: 'Movies' },
  { path: '/tvshows', label: 'TV Shows' }
];

export const ROUTES = {
  HOME: '/',
  TRENDING: '/trending',
  NOW_PLAYING: '/nowplaying',
  TOP_RATED: '/toprated',
  GENRES: '/genres',
  MOVIES: '/movies',
  TV_SHOWS: '/tvshows',
  MOVIE_DETAIL: (id) => `/movie/${id}`,
  CAST: (id) => `/cast/${id}`,
  CREW: (id) => `/crew/${id}`,
  COMPANY: (id) => `/company/${id}`
};