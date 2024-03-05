export class TmdbMovie {
  id:number;
  tmdb_id:number;
  poster_path:string;
  title:string;
  release_date:string;
  overview:string;
  runtime:number;

  constructor(tmdbmovie:any) {
    this.id = tmdbmovie.id || -1;
    this.tmdb_id = tmdbmovie.tmdb_id || -1;
    this.poster_path = tmdbmovie.poster_path || '';
    this.title = tmdbmovie.title || '';
    this.release_date = tmdbmovie.release_date || '';
    this.overview = tmdbmovie.overview || '';
    this.runtime = tmdbmovie.runtime || -1;
  }
}
