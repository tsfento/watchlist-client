import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { environment } from '../../../environments/environment';
import { TmdbResponse } from '../../shared/models/tmdbresponse';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  listTitles:WatchTitle[] = [];
  gotListTitles = new BehaviorSubject<WatchTitle[]>([]);

  constructor(private http:HttpClient) { }

  getTitles(id:number, username:string) {
    this.http.get<WatchTitle[]>(`${environment.apiUrl}/users/${username}/lists/${id}`).subscribe({
      next: (response:WatchTitle[]) => {
        this.listTitles = response;
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        this.gotListTitles.next(this.listTitles.slice());
      }
    });
  }
}
