import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  constructor(private http:HttpClient) { }

  getNowPlayingMovies() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/now_playing_movies`);
  }

  getPopularMovies() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/popular_movies`);
  }

  getPopularTV() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/popular_tv`);
  }

  getTopRatedTV() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/top_rated_tv`);
  }

  getTitleDetails(tmdbId:number, contentType:string) {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/${contentType}/details/${tmdbId}`);
  }
}
