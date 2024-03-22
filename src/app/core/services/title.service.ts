import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { environment } from '../../../environments/environment';
import { TmdbResponse } from '../../shared/models/tmdbresponse';
import { WatchTitleSend } from '../../shared/models/watchtitlesend';
import { TmdbMovie } from '../../shared/models/tmdbmovie';
import { UserWatchTitle } from '../../shared/models/user-watch-title';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  listTitles:WatchTitle[] = [];
  gotListTitles = new BehaviorSubject<WatchTitle[]>([]);

  titleToAddSubject = new BehaviorSubject<WatchTitleSend>(new WatchTitleSend(-1, '', '', '', '', '', -1));

  constructor(private http:HttpClient) { }

  getTitles(id:number, username:string) {
    this.http.get<WatchTitle[]>(`${environment.apiUrl}/users/${username}/lists/${id}`).subscribe({
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
}
