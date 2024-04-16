import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http:HttpClient, private router:Router, private userService:UserService) { }

  login(username:string, password:string) {
    return this.http.post<{token:string}>(`${environment.apiUrl}/login`,
    {
      username,
      password
    }).pipe(switchMap((res:any) => {
      this.setToken(res.token);
      return this.userService.getBootstrapData();
    }));
  }

  signUp(email:string, username:string, password:string, password_confirmation:string) {
    return this.http.post(`${environment.apiUrl}/users/sign_up`, {
      email,
      username,
      password,
      password_confirmation
    });
  }

  setToken(token:string) {
    localStorage.setItem('wewatch_token', token);
  }

  getToken() {
    return localStorage.getItem('wewatch_token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  autoLogin() {
    const token = localStorage.getItem('wewatch_token');

    if (token !== null) {
      this.http.post(`${environment.apiUrl}/check_token`, {
        token: token
      }).subscribe({
        next: (res:any) => {
          this.setToken(res.token);
        },
        error: (error:any) => {
          if (error.error['error'] === 'Token expired') {
            this.logout();
          }
        }
      });
    } else {
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('wewatch_token');
    this.userService.setCurrentUser(null);
    this.router.navigate(['/welcome']);
  }
}
