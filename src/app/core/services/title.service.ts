import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WatchTitle } from '../../shared/models/watchtitle';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private http:HttpClient) { }

  getTitles(id:number, username:string): Observable<WatchTitle[]>{
    return this.http.get<WatchTitle[]>(`${environment.apiUrl}/users/${username}/lists/${id}`);
  }
}
