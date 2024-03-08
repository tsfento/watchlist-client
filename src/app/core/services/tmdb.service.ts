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
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        // this.gotNowPlayingMovies.next(this.nowPlayingMovies.slice());
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
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        // this.gotPopularMovies.next(this.popularMovies.slice());
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
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        // this.gotPopularTV.next(this.popularTV.slice());
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
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        // this.gotTopRatedTv.next(this.topRatedTV.slice());
      }
    });
  }

  getTitleDetails(tmdbTitle:TmdbMovie, contentType:string) {
    this.http.get<any>(`${environment.apiUrl}/tmdb/${contentType}/details/${tmdbTitle.id}`).subscribe({
      next: (response:TmdbMovie) => {
        tmdbTitle.runtime = response.runtime;
        tmdbTitle.imdb_id = response.imdb_id;
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        this.gotNowPlayingMovies.next(this.nowPlayingMovies.slice());
        this.gotPopularMovies.next(this.popularMovies.slice());
        this.gotPopularTV.next(this.popularTV.slice());
        this.gotTopRatedTv.next(this.topRatedTV.slice());
      }
    });
  }
}
