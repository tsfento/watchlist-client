export class TmdbResponse {
  results:any

  constructor(response:any) {
    this.results = response.results
  }
}
