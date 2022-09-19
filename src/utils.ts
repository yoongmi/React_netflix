export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}

export enum MovieCurrent {
  "now_playing" = "now_playing",
  "popular" = "popular",
  "top_rated" = "top_rated",
  "upcoming" = "upcoming",
}

export enum TvCurrent {
  "on_the_air" = "on_the_air",
  "airing_today" = "airing_today",
  "popular" = "popular",
  "top_rated" = "top_rated",
}
