const API_KEY = "89b59b87fa2b3c5111c4f6560b25789e";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies(search_name: string) {
  return fetch(
    `${BASE_PATH}/movie/${search_name}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getCredit(movie_id: string | undefined) {
  return fetch(
    `${BASE_PATH}/movie/${movie_id}/credits?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getTv(search_name: string) {
  return fetch(
    `${BASE_PATH}/tv/${search_name}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getTvCredit(tv_id: string | undefined) {
  return fetch(
    `${BASE_PATH}/tv/${tv_id}/credits?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getSearchMovies(search_keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=ko-KR&query=${search_keyword}`
  ).then((response) => response.json());
}

export function getSearchTv(search_keyword: string | null) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${API_KEY}&language=ko-KR&query=${search_keyword}`
  ).then((response) => response.json());
}
