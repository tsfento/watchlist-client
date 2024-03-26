import { WatchTitle } from "./watchtitle";

export class TmdbResponse {
  page:number;
  results:WatchTitle[];
  total_pages:number;

  constructor(response:any) {
    this.page = response.page;
    this.results = response.results;
    this.total_pages = response.total_pages;
  }
}
