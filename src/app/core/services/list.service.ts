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

  listIdToDelete:number = 0;
  listIndexToDelete:number = 0;
  currentUserUsername:string = '';

  constructor(private http:HttpClient) { }

  getAllLists() {
    this.http.get<WatchList[]>(`${environment.apiUrl}/lists`).subscribe({
      next: (response:WatchList[]) => {
        this.allLists = response;

        if (this.allLists !== null) {
          this.gotAllLists.next(this.allLists.slice());
        }
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getUserLists(username:string = '') {
    this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/lists`).subscribe({
      next: (response:WatchList[]) => {
        this.userLists = response;

        if (this.userLists !== null) {
          this.gotUserLists.next(this.userLists.slice());
        }
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getFollowedLists(username:string = '') {
    this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/followed_lists`).subscribe({
      next: (response:WatchList[]) => {
        this.followedLists = response;

        if (this.followedLists !== null) {
          this.gotFollowedLists.next(this.followedLists.slice());
        }
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  setListIdToDelete(listId:number, listIndex:number, username:string) {
    this.listIdToDelete = listId;
    this.listIndexToDelete = listIndex;
    this.currentUserUsername = username;
  }

  deleteList() {
    this.http.delete(`${environment.apiUrl}/users/${this.currentUserUsername}/lists/${this.listIdToDelete}`).subscribe();
    this.userLists.splice(this.listIndexToDelete, 1);
    this.gotUserLists.next(this.userLists.slice());
  }
}
