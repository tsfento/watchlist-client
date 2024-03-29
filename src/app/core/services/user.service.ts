import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../../shared/models/user';
import { environment } from '../../../environments/environment';
import { WatchTitle } from '../../shared/models/watchtitle';
import { UserWatchTitle } from '../../shared/models/user-watch-title';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser:User | null = null;
  currentUserBehaviorSubject = new BehaviorSubject<User | null>(null);
  currentUserWatchTitles:UserWatchTitle[] | null = null;
  currentUserWatchTitlesSubject = new BehaviorSubject<UserWatchTitle[] | null>(null);
  watchDates:{[key: string]: WatchTitle[]}[] | null = null;
  watchDatesBehaviorSubject = new BehaviorSubject<{[key: string]: WatchTitle[]}[] | null>(null);

  constructor(private http:HttpClient) { }

  setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.currentUserBehaviorSubject.next(this.currentUser);
  }

  getBootstrapData() {
    return this.http.get(`${environment.apiUrl}/web/bootstrap`).pipe(
      tap((response:any) => {
        this.setCurrentUser(response.current_user);
      })
    );
  }

  getUserWatchTitles() {
    if (this.currentUser !== null) {
      this.http.get<UserWatchTitle[]>(`${environment.apiUrl}/users/${this.currentUser.username}/user_watch_titles`).subscribe({
        next: (response:UserWatchTitle[]) => {
          this.currentUserWatchTitles = response;
          this.currentUserWatchTitlesSubject.next(this.currentUserWatchTitles.slice());
          // console.log(response);
        },
        error: (error:any) => {
          console.log(error);
        }
      });
    }
  }

  getUserWatchDates() {
    if (this.currentUser !== null) {
      this.http.get(`${environment.apiUrl}/users/${this.currentUser?.username}/watch_dates`).subscribe({
        next: (response:any) => {
          this.watchDates = response;
          this.watchDatesBehaviorSubject.next(this.watchDates);
        },
        error: (error:any) => {
          console.log(error);
        }
      })
    }
  }
}
