import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WatchList } from '../../shared/models/watchlist';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  allLists:WatchList[] = [];
  gotAllLists = new BehaviorSubject<WatchList[]>([]);
  userLists:WatchList[] = [];
  gotUserLists = new BehaviorSubject<WatchList[]>([]);
  followedLists:WatchList[] = [];
  gotFollowedLists = new BehaviorSubject<WatchList[]>([]);

  constructor(private http:HttpClient) { }

  getAllLists() {
    this.http.get<WatchList[]>(`${environment.apiUrl}/lists`).subscribe({
      next: (response:WatchList[]) => {
        this.allLists = response;
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        if (this.allLists !== null) {
          this.gotAllLists.next(this.allLists.slice());
        }
      }
    });
  }

  getUserLists(username:string = '') {
    this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/lists`).subscribe({
      next: (response:WatchList[]) => {
        this.userLists = response;
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        if (this.userLists !== null) {
          this.gotUserLists.next(this.userLists.slice());
        }
      }
    });
  }

  getFollowedLists(username:string = '') {
    this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/followed_lists`).subscribe({
      next: (response:WatchList[]) => {
        this.followedLists = response;
      },
      error: (error:any) => {
        console.error(error);
      },
      complete: () => {
        if (this.followedLists !== null) {
          this.gotFollowedLists.next(this.followedLists.slice());
        }
      }
    });
  }
}
