import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WatchList } from '../../shared/models/watchlist';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http:HttpClient) { }

  getAllLists(): Observable<WatchList[]>{
    return this.http.get<WatchList[]>(`${environment.apiUrl}/lists`);
  }

  getUserLists(): Observable<WatchList[]>{
    return this.http.get<WatchList[]>(`${environment.apiUrl}/users/follower/lists`);
  }

  getFollowedLists(): Observable<WatchList[]>{
    return this.http.get<WatchList[]>(`${environment.apiUrl}/users/follower/followed_lists`);
  }
}
