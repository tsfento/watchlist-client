import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../../shared/models/user';
import { environment } from '../../../environments/environment';
import { WatchTitle } from '../../shared/models/watchtitle';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser:User | null = null;
  currentUserBehaviorSubject = new BehaviorSubject<User | null>(null);
  watchDates:{[key: string]: WatchTitle[]}[] | null = null;
  watchDatesBehaviorSubject = new BehaviorSubject<{[key: string]: WatchTitle[]}[] | null>(null);

  constructor(private http:HttpClient) { }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.currentUserBehaviorSubject.next(this.currentUser);
  }

  getBootstrapData() {
    return this.http.get(`${environment.apiUrl}/web/bootstrap`).pipe(
      tap((res:any) => {
        this.setCurrentUser(res.current_user);
      })
    );
  }

  getUserWatchDates() {
    this.http.get(`${environment.apiUrl}/users/${this.currentUser?.username}/watch_dates`).subscribe({
      next: (response:any) => {
        // const json:any = JSON.stringify(response)
        // this.watchDates = JSON.parse(json);
        // console.log(this.watchDates);
        this.watchDates = response;
        this.watchDatesBehaviorSubject.next(this.watchDates);
      },
      error: (error:any) => {
        console.log(error);
      }
    })
  }
}
