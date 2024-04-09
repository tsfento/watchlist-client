import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { TmdbResponse } from '../../shared/models/tmdbresponse';
import { BehaviorSubject } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  nowPlayingMovies:TmdbMovie[] = [];
  gotNowPlayingMovies = new BehaviorSubject<TmdbMovie[]>([]);

  popularMovies:TmdbMovie[] = [];
  gotPopularMovies = new BehaviorSubject<TmdbMovie[]>([]);

  trendingTV:TmdbMovie[] = [];
  gotTrendingTV = new BehaviorSubject<TmdbMovie[]>([]);

  thisWeekTV:TmdbMovie[] = [];
  gotThisWeekTV = new BehaviorSubject<TmdbMovie[]>([]);

  searchValue:string = '';
  searchSubject = new BehaviorSubject<string>('');

  searchResults:TmdbMovie[] = [];
  gotSearchResults = new BehaviorSubject<TmdbMovie[]>([]);
  gettingRuntime:boolean = false;
  gettingNextPage:boolean = false;
  pageNum:number = 1;
  totalPages:number = 1;

  recommendations:{[key: string]: TmdbMovie[]}[] = [];
  gotRecommendations = new BehaviorSubject<{[key: string]: TmdbMovie[]}[]>([]);
  recsIndex:number = 0;
  gotRecsIndex = new BehaviorSubject<number>(0);

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

  getTrendingTV() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/trending_tv`).subscribe({
      next: (response:TmdbResponse) => {
        const tempTrendingTV = response.results;

        tempTrendingTV.forEach((m:TmdbMovie) => {
          this.getTitleDetails(m, 'tv');
        });
        this.trendingTV = tempTrendingTV;
        this.gotTrendingTV.next(this.trendingTV.slice());
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getThisWeekTV() {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/this_week_tv`).subscribe({
      next: (response:TmdbResponse) => {
        const tempThisWeekTV = response.results;

        tempThisWeekTV.forEach((m:TmdbMovie) => {
          this.getTitleDetails(m, 'tv');
        });
        this.thisWeekTV = tempThisWeekTV;
        this.gotThisWeekTV.next(this.thisWeekTV.slice());
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getTitleDetails(tmdbTitle:TmdbMovie, contentType:string) {
    this.http.get<any>(`${environment.apiUrl}/tmdb/${contentType}/details/${tmdbTitle.id}`).subscribe({
      next: (response:TmdbMovie) => {
        if (contentType === 'movie') {
          tmdbTitle.runtime = response.runtime;
          tmdbTitle.imdb_id = response.imdb_id;
        } else if (contentType === 'tv') {
          tmdbTitle.imdb_id = response.imdb_id;
          tmdbTitle.first_air_date = response.first_air_date;
        }
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  setSearch(search:string) {
    this.searchSubject.next(search);
  }

  getSearchResults(query:string, type:string = 'movie', lang:string = 'en', page:number = 1) {
    if (page === 1) {
      this.searchResults = [];
      this.gotSearchResults.next(this.searchResults);
    }

    if (page <= this.totalPages) {
      this.http.post<any>(`${environment.apiUrl}/tmdb/search`, {
        query: query,
        type: type,
        lang: lang,
        page: page
      }).subscribe({
        next: (response:TmdbResponse) => {
          // console.log(response);
          this.pageNum = response.page;
          this.totalPages = response.total_pages;
          const tempSearchResults = response.results;

          if (type === 'movie') {
            tempSearchResults.forEach((m:TmdbMovie) => {
              this.getTitleDetails(m, 'movie');
            });
            this.searchResults = tempSearchResults;
            this.gotSearchResults.next(this.searchResults.slice());
          } else {
            this.searchResults = tempSearchResults;
            this.gotSearchResults.next(this.searchResults.slice());
          }
        },
        error: (error:any) => {
          console.error(error);
        }
      });
    }
  }

  getRecommendations(type:string, watchTitle:WatchTitle, sentRecs:{[key: string]: TmdbMovie[]}[]) {
    if (this.recommendations.length > sentRecs.length) {
      this.gotRecommendations.next(this.recommendations.slice());
    } else {
      let titleRecs:{[key: string]: any} = {};
      let recs = [];

      this.http.get<TmdbResponse>(`${environment.apiUrl}/tmdb/${type}/${watchTitle.tmdb_id}/recommendations`).subscribe({
        next: (response:TmdbResponse) => {
          recs = response.results;
          if (recs.length !== 0) {
            recs.forEach((t) => {
              this.getRecommendationDetails(t, type).subscribe({
                next: (response:TmdbMovie) => {
                  if (type === 'movie') {
                    t.runtime = response.runtime;
                    t.imdb_id = response.imdb_id;
                    t.content_type = 'movie'
                  } else if (type === 'tv') {
                    t.imdb_id = response.imdb_id;
                    t.first_air_date = response.first_air_date;
                    t.content_type = 'tv'
                  }
                },
                error: (error:any) => {
                  console.error(error);
                }
              });
            });

            titleRecs[watchTitle.title] = response.results;
            this.recommendations = [...this.recommendations, titleRecs];
            this.recsIndex++;
            this.gotRecsIndex.next(this.recsIndex);
            this.gotRecommendations.next(this.recommendations.slice());
          } else {
            this.recsIndex++;
            this.gotRecsIndex.next(this.recsIndex);
          }
        },
        error: (error:any) => {
          console.log(error);
        }
      });;
    }
  }

  getRecommendationDetails(tmdbTitle:TmdbMovie, contentType:string) {
    return this.http.get<any>(`${environment.apiUrl}/tmdb/${contentType}/details/${tmdbTitle.id}`);
  }
}
