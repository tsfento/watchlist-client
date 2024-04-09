export class TmdbMovie {
  id:number;
  tmdb_id:number;
  imdb_id:string;
  poster_path:string;
  title:string;
  name:string;
  release_date:string;
  original_name:string;
  overview:string;
  runtime:number;
  first_air_date:string;
  content_type:string;

  constructor(tmdbmovie:any) {
    this.id = tmdbmovie.id || -1;
    this.tmdb_id = tmdbmovie.tmdb_id || -1;
    this.imdb_id = tmdbmovie.imdb_id || '';
    this.poster_path = tmdbmovie.poster_path || '';
    this.title = tmdbmovie.title || '';
    this.name = tmdbmovie.name || '';
    this.release_date = tmdbmovie.release_date || '';
    this.original_name = tmdbmovie.original_name || '';
    this.overview = tmdbmovie.overview || '';
    this.runtime = tmdbmovie.runtime || -1;
    this.first_air_date = tmdbmovie.first_air_date || '';
    this.content_type = tmdbmovie.content_type || 'movie';
  }
}
