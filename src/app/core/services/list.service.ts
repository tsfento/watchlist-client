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
  listErrorSubject = new BehaviorSubject<string>('');

  listIdToDelete:number = 0;
  listIndexToDelete:number = 0;
  currentUserUsername:string = '';

  allListsPageNum = 1;
  userListsPageNum = 1;
  followedListsPageNum = 1;

  constructor(private http:HttpClient) { }

  getAllLists() {
    this.http.get<WatchList[]>(`${environment.apiUrl}/lists?page=${this.allListsPageNum}`).subscribe({
      next: (response:WatchList[]) => {
        if (response.length !== 0) {
          this.allLists = [...this.allLists, ...response];
          this.gotAllLists.next(this.allLists.slice());
          this.allListsPageNum++
        }
      },
      error: (error:any) => {
        console.error(error);
      }
    });
  }

  getUserLists(username:string) {
    if (username !== '') {
      this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/lists?page=${this.userListsPageNum}`).subscribe({
        next: (response:WatchList[]) => {
          if (response.length !== 0) {
            this.userLists = [...this.userLists, ...response];
            this.gotUserLists.next(this.userLists.slice());
            this.userListsPageNum++
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

  getFollowedLists(username:string) {
    if (username !== '') {
      this.http.get<WatchList[]>(`${environment.apiUrl}/users/${username}/followed_lists?page=${this.followedListsPageNum}`).subscribe({
        next: (response:WatchList[]) => {
          if (response.length !== 0) {
            this.followedLists = [...this.followedLists, ...response];
            this.gotFollowedLists.next(this.followedLists.slice());
            this.followedListsPageNum++
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
      next: (response:WatchList) => {
        this.userLists.push(response);
        this.gotUserLists.next(this.userLists.slice());
      },
      error: (response:any) => {
        this.listErrorSubject.next(response.error['title'][0]);
      }
    });
  }

  followList(username:string, listId:number) {
    this.http.get<WatchList>(`${environment.apiUrl}/users/follow_list/${listId}`).subscribe({
      next: (response:any) => {
        // const list = this.allLists.find(l => l.id === listId);
        // if (list !== undefined) {
        //   if (!this.followedLists.some(l => l.id === listId)) {
        //     this.followedLists.push(list);
        //   }
        //   this.gotFollowedLists.next(this.followedLists.slice());
        // }
        this.followedListsPageNum = 1;
        this.getFollowedLists(username);
      },
      error: (response:any) => {
        console.log(response.error);
      }
    });
  }

  unfollowList(username:string, listId:number) {
    this.http.get<WatchList>(`${environment.apiUrl}/users/unfollow_list/${listId}`).subscribe({
      next: (response:any) => {
        const list = this.followedLists.find(l => l.id === listId);
        if (list !== undefined) {
          const index = this.followedLists.indexOf(list);
          this.followedLists.splice(index, 1);
          this.gotFollowedLists.next(this.followedLists.slice());
        }
        // this.followedListsPageNum = 1;
        // this.getFollowedLists(username);
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

  setListPrivacy(username:string, listId:number) {
    return this.http.get<WatchList>(`${environment.apiUrl}/users/${username}/${listId}/set_privacy`);
  }

  deleteList() {
    this.http.delete(`${environment.apiUrl}/users/${this.currentUserUsername}/lists/${this.listIdToDelete}`).subscribe();
    this.userLists.splice(this.listIndexToDelete, 1);
    this.gotUserLists.next(this.userLists.slice());
  }
}
