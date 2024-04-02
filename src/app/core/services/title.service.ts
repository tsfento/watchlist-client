import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { environment } from '../../../environments/environment';
import { WatchTitleSend } from '../../shared/models/watchtitlesend';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { UserService } from './user.service';
import { DailyQuote } from '../../shared/models/daily-quote';
@Injectable({
  providedIn: 'root'
})
export class TitleService {
  listTitles:WatchTitle[] = [];
  gotListTitles = new BehaviorSubject<WatchTitle[]>([]);

  titleToAddSubject = new BehaviorSubject<WatchTitleSend>(new WatchTitleSend(-1, '', '', '', '', '', -1));

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

  setTitleToAdd(title:TmdbMovie) {
    this.titleToAddSubject.next(new WatchTitleSend(
      title.id,
      title.imdb_id,
      title.poster_path,
      title.title,
      title.release_date,
      title.overview,
      title.runtime
    ));
  }

  setTitleWatched(username:string, title:TmdbMovie, getUserWatchTitles:boolean = false) {
    this.http.post(`${environment.apiUrl}/users/${username}/set_watched`, {
      tmdb_id: title.id,
      imdb_id: title.imdb_id,
      poster_path: title.poster_path,
      title: title.title,
      release_date: title.release_date,
      overview: title.overview,
      runtime: title.runtime
    }).subscribe({
      next: (response:any) => {
        // console.log(response.watched);
        if (getUserWatchTitles === true) {
          this.userService.updateUserWatchTitles(response);
        }
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }

  setTitleRating(username:string, title:TmdbMovie, rating:boolean | null, getUserWatchTitles:boolean = false) {
    this.http.post(`${environment.apiUrl}/users/${username}/set_rating`, {
      tmdb_id: title.id,
      imdb_id: title.imdb_id,
      poster_path: title.poster_path,
      title: title.title,
      release_date: title.release_date,
      overview: title.overview,
      runtime: title.runtime,
      rating: rating
    }).subscribe({
      next: (response:any) => {
        // console.log(response);
        if (getUserWatchTitles === true) {
          this.userService.updateUserWatchTitles(response);
        }
      },
      error: (error:any) => {
        console.log(error);
      }
    });
  }

  getQuote() {
    this.http.get<DailyQuote[]>(`${environment.apiUrl}/quote`).subscribe({
      next: (response:DailyQuote[]) => {
        this.dailyQuoteSubject.next(response[0]);
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }
}
