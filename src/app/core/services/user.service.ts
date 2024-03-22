import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../../shared/models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUserBehaviorSubject = new BehaviorSubject<User | null>(null);

  constructor(private http:HttpClient) { }

  setCurrentUser(user: User | null) {
    this.currentUserBehaviorSubject.next(user);
  }

  getBootstrapData() {
    return this.http.get(`${environment.apiUrl}/web/bootstrap`).pipe(
      tap((res:any) => {
        this.setCurrentUser(res.current_user);
      })
    );
  }

  deleteList(username:string, listId:number) {
    this.http.delete(`${environment.apiUrl}/users/${username}/lists/${listId}`).subscribe();
  }
}
