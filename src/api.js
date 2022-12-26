import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;
const baseURL = process.env.REACT_APP_BASEURL;

export const getMovieList = async () => {
  const movie = await axios.get(
    `${baseURL}/movie/popular?page=1&api_key=${apiKey}`
  );
  await console.log({ movieList: movie });
  return movie.data.results;
};

export const searchMovie = async (q) => {
  const search = await axios.get(
    `${baseURL}/search/movie?query=${q}&page=1&api_key=${apiKey}`
  );
  return search.data;
};
