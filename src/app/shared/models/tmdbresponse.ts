export class TmdbResponse {
  page:number;
  results:any;
  total_pages:number;

  constructor(response:any) {
    this.page = response.page;
    this.results = response.results;
    this.total_pages = response.total_pages;
  }
}
