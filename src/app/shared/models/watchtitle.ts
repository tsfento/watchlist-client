export class WatchTitle {
  id:number;
  tmdb_id:number;
  imdb_id:string;
  poster_path:string;
  title:string;
  release_date:string;
  overview:string;
  runtime:number;

  constructor(watchTitle:any) {
    this.id = watchTitle.id;
    this.tmdb_id = watchTitle.tmdb_id;
    this.imdb_id = watchTitle.imdb_id;
    this.poster_path = watchTitle.poster_path;
    this.title = watchTitle.title;
    this.release_date = watchTitle.release_date;
    this.overview = watchTitle.overview;
    this.runtime = watchTitle.runtime;
  }
}
