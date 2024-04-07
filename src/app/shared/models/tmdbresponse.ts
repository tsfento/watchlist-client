import { TmdbMovie } from "./tmdbmovie";
import { WatchTitle } from "./watchtitle";

export class TmdbResponse {
  page:number;
  results:TmdbMovie[];
  total_pages:number;

  constructor(response:any) {
    this.page = response.page;
    this.results = response.results;
    this.total_pages = response.total_pages;
  }
}
