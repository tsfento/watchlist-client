import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { environment } from '../../../environments/environment';
import { WatchTitleSend } from '../../shared/models/watchtitlesend';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { UserService } from './user.service';
import { DailyQuote } from '../../shared/models/daily-quote';
import { UserWatchTitle } from '../../shared/models/user-watch-title';
@Injectable({
  providedIn: 'root'
})
export class TitleService {
  listTitles:WatchTitle[] = [];
  gotListTitles = new BehaviorSubject<WatchTitle[]>([]);

  titleToAddSubject = new BehaviorSubject<WatchTitleSend>(new WatchTitleSend(-1, '', '', '', '', '', -1, ''));
  titleTmdbId:number = 0;

  dailyQuoteSubject = new BehaviorSubject<DailyQuote | null>(null);

  constructor(private http:HttpClient, private userService:UserService) { }

  getTitles(id:number, username:string, pageNum:number) {
    this.http.get<WatchTitle[]>(`${environment.apiUrl}/users/${username}/lists/${id}?page=${pageNum}`).subscribe({
      next: (response:WatchTitle[]) => {
        this.listTitles = response;
        // console.log(response);
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        this.gotListTitles.next(this.listTitles.slice());
      }
    });
  }

  deleteTitle(username:string, listId:number, tmdbId:number) {
    this.http.delete(`${environment.apiUrl}/users/${username}/lists/${listId}/${tmdbId}`).subscribe();
    const titleIndex = this.listTitles.map(t => t.tmdb_id).indexOf(tmdbId);
    this.listTitles.splice(titleIndex, 1);
    this.gotListTitles.next(this.listTitles.slice());
  }

  setTitleToAdd(title:TmdbMovie, contentType:string, tmdbId?:number) {
    if (tmdbId) {
      this.titleTmdbId = tmdbId;
    } else {
      this.titleTmdbId = title.id;
    }

    if (contentType === 'movie') {
      this.titleToAddSubject.next(new WatchTitleSend(
        this.titleTmdbId,
        title.imdb_id,
        title.poster_path,
        title.title,
        title.release_date,
        title.overview,
        title.runtime,
        'movie'
      ));
    } else if (contentType === 'tv') {
      this.titleToAddSubject.next(new WatchTitleSend(
        this.titleTmdbId,
        title.imdb_id,
        title.poster_path,
        title.name,
        title.first_air_date,
        title.overview,
        title.runtime || 0,
        'tv'
      ));
    }
  }

  setTitleWatched(username:string, title:TmdbMovie, contentType:string, tmdbId?:number) {
    let id:number = 0;
    let postBody = {};

    if (tmdbId) {
      id = tmdbId;
    } else {
      id = title.id;
    }

    if (contentType === 'movie') {
      postBody = {
        tmdb_id: id,
        imdb_id: title.imdb_id,
        poster_path: title.poster_path,
        title: title.title,
        release_date: title.release_date,
        overview: title.overview,
        runtime: title.runtime
      }
    } else if (contentType === 'tv') {
      postBody = {
        tmdb_id: id,
        imdb_id: title.imdb_id,
        poster_path: title.poster_path,
        title: title.name,
        release_date: title.first_air_date,
        overview: title.overview,
        runtime: title.runtime || 0,
        content_type: title.content_type || 'tv'
      }
    }

    this.http.post<UserWatchTitle>(`${environment.apiUrl}/users/${username}/set_watched`, postBody).subscribe({
      next: (response:UserWatchTitle) => {
        // console.log(response.watched);
        this.userService.addUserWatchTitle(response);
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }

  setTitleRating(username:string, title:TmdbMovie, rating:boolean | null, contentType:string, tmdbId?:number) {
    let id:number = 0;
    let postBody = {};

    if (tmdbId) {
      id = tmdbId;
    } else {
      id = title.id;
    }

    if (contentType === 'movie') {
      postBody = {
        tmdb_id: id,
        imdb_id: title.imdb_id,
        poster_path: title.poster_path,
        title: title.title,
        release_date: title.release_date,
        overview: title.overview,
        runtime: title.runtime,
        rating: rating
      }
    } else if (contentType === 'tv') {
      postBody = {
        tmdb_id: id,
        imdb_id: title.imdb_id,
        poster_path: title.poster_path,
        title: title.name,
        release_date: title.first_air_date,
        overview: title.overview,
        runtime: title.runtime || 0,
        content_type: title.content_type || 'tv',
        rating: rating
      }
    }

    this.http.post<UserWatchTitle>(`${environment.apiUrl}/users/${username}/set_rating`, postBody).subscribe({
      next: (response:UserWatchTitle) => {
        // console.log(response);
        this.userService.addUserWatchTitle(response);
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }

  getQuote() {
    this.http.get<DailyQuote[]>(`${environment.apiUrl}/quote`).subscribe({
      next: (response:DailyQuote[]) => {
        if (response.length !== 0) {
          this.dailyQuoteSubject.next(response[0]);
        }
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }
}
