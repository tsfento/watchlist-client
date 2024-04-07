import { UserWatchTitle } from "./user-watch-title";

export class WatchTitle {
  id:number;
  tmdb_id:number;
  imdb_id:string;
  poster_path:string;
  title:string;
  original_name:string;
  release_date:string;
  overview:string;
  runtime:number;
  first_air_date:string;
  current_user_watch_titles:UserWatchTitle[];

  constructor(watchTitle:any) {
    this.id = watchTitle.id;
    this.tmdb_id = watchTitle.tmdb_id;
    this.imdb_id = watchTitle.imdb_id;
    this.poster_path = watchTitle.poster_path;
    this.title = watchTitle.title;
    this.original_name = watchTitle.original_name;
    this.release_date = watchTitle.release_date;
    this.overview = watchTitle.overview;
    this.runtime = watchTitle.runtime;
    this.first_air_date = watchTitle.first_air_date;
    this.current_user_watch_titles = watchTitle.current_user_watch_titles;
  }
}
