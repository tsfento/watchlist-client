import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { TmdbResponse } from '../../shared/models/tmdbresponse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  nowPlayingMovies:TmdbMovie[] = [];
  gotNowPlayingMovies = new BehaviorSubject<TmdbMovie[]>([]);

  popularMovies:TmdbMovie[] = [];
  gotPopularMovies = new BehaviorSubject<TmdbMovie[]>([]);

  popularTV:TmdbMovie[] = [];
  gotPopularTV = new BehaviorSubject<TmdbMovie[]>([]);

  topRatedTV:TmdbMovie[] = [];
  gotTopRatedTv = new BehaviorSubject<TmdbMovie[]>([]);

  constructor(private http:HttpClient) { }

  getNowPlayingMovies() {
    this.http.get<TmdbResponse>(`${environment.apiUrl}/tmdb/now_playing_movies`).subscribe({
      next: (response:TmdbResponse) => {
        const tempNowPlayingMovies = response.results;

        tempNowPlayingMovies.forEach((m:TmdbMovie) => {
          this.getTitleDetails(m, 'movie');
        });
        this.nowPlayingMovies = tempNowPlayingMovies;

        this.gotNowPlayingMovies.next(this.nowPlayingMovies.slice());
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getPopularMovies() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/popular_movies`).subscribe({
      next: (response:TmdbResponse) => {
        const tempPopularMovies = response.results;

        tempPopularMovies.forEach((m:TmdbMovie) => {
          this.getTitleDetails(m, 'movie');
        });
        this.popularMovies = tempPopularMovies;

        this.gotPopularMovies.next(this.popularMovies.slice());
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getPopularTV() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/popular_tv`).subscribe({
      next: (response:TmdbResponse) => {
        const tempPopularTV = response.results;

        // tempPopularTV.forEach((m:TmdbMovie) => {
        //   this.getTitleDetails(m, 'movie');
        // });
        this.popularTV = tempPopularTV;

        this.gotPopularTV.next(this.popularTV.slice());
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getTopRatedTV() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/top_rated_tv`).subscribe({
      next: (response:TmdbResponse) => {
        const tempTopRatedTV = response.results;

        // tempTopRatedTV.forEach((m:TmdbMovie) => {
        //   this.getTitleDetails(m, 'movie');
        // });
        this.topRatedTV = tempTopRatedTV;

        this.gotTopRatedTv.next(this.topRatedTV.slice());
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getTitleDetails(tmdbTitle:TmdbMovie, contentType:string):TmdbMovie {
    this.http.get<any>(`${environment.apiUrl}/tmdb/${contentType}/details/${tmdbTitle.id}`).subscribe({
      next: (response:TmdbMovie) => {
        tmdbTitle.runtime = response.runtime;
      },
      error: (error:any) => {
        console.error(error);
      }
    });

    return tmdbTitle;
  }
}
