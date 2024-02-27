import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  constructor(private http:HttpClient) { }

  getNowPlayingMovies() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/now_playing`);
  }

  getPopularMovies() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/popular`);
  }
}
