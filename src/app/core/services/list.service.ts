import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WatchList } from '../../shared/models/watchlist';
import { WatchTitle } from '../../shared/models/watchtitle';

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

  getAllLists(pageNum:number) {
    this.http.get<WatchList[]>(`${environment.apiUrl}/lists?page=${pageNum}`).subscribe({
      next: (response:WatchList[]) => {
        this.allLists = [...this.allLists, ...response];

        if (response.length !== 0) {
          this.gotAllLists.next(response);
        }
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getUserLists(username:string, pageNum:number) {
    if (username !== '') {
      this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/lists?page=${pageNum}`).subscribe({
        next: (response:WatchList[]) => {
          this.userLists = [...this.userLists, ...response];

          if (response.length !== 0) {
            this.gotUserLists.next(response);
          }
        },
        error: (error:any) => {
          console.error(error);
        }
      });
    }
  }

  getUserListsForAdding(username:string) {
    return this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/lists?page=-1`);
  }

  getFollowedLists(username:string, pageNum:number) {
    if (username !== '') {
      this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/followed_lists?page=${pageNum}`).subscribe({
        next: (response:WatchList[]) => {
          this.followedLists = [...this.followedLists, ...response];

          if (response.length !== 0) {
            this.gotFollowedLists.next(response);
          }
        },
        error: (error:any) => {
          console.error(error);
        }
      });
    }
  }

  createList(username:string, form:FormData) {
    this.http.post<WatchList>(`${environment.apiUrl}/users/${username}/lists`, form).subscribe({
      next: (response:any) => {
        this.getUserLists(username, 1);
      },
      error: (response:any) => {
        console.log(response.error);
      }
    });
  }

  followList(username:string, listId:number, pageNum:number) {
    this.http.get<WatchList>(`${environment.apiUrl}/users/follow_list/${listId}`).subscribe({
      next: (response:any) => {
        // this.getFollowedLists(username, pageNum);
      },
      error: (response:any) => {
        console.log(response.error);
      }
    });
  }

  unfollowList(username:string, listId:number, pageNum:number) {
    this.http.get<WatchList>(`${environment.apiUrl}/users/unfollow_list/${listId}`).subscribe({
      next: (response:any) => {
        // this.getFollowedLists(username, pageNum);
      },
      error: (response:any) => {
        console.log(response.error);
      }
    });
  }

  searchTitlesInList(watchListId:number, searchString:string, pageNum:number) {
    return this.http.post<WatchTitle[]>(`${environment.apiUrl}/lists/${watchListId}/search?page=${pageNum}`, {
      search: searchString,
      page: pageNum
    });
  }

  getRandomTitleFromList(watchListId:number) {
    return this.http.get<WatchTitle>(`${environment.apiUrl}/lists/${watchListId}/random`);
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
