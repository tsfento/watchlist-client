import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { List } from '../../shared/models/list';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  constructor(private http:HttpClient) { }

  getAllLists(): Observable<List[]>{
    return this.http.get<List[]>(`${environment.apiUrl}/lists`);
  }

  getUserLists(): Observable<List[]>{
    return this.http.get<List[]>(`${environment.apiUrl}/users/testing/lists`);
  }
}
