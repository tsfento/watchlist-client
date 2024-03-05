import { Component, OnInit } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { WatchList } from '../../shared/models/watchlist';
import { WatchTitle } from '../../shared/models/watchtitle';
import { TitleService } from '../../core/services/title.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit{
  currentUser:User | null = null;
  newListForm:FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    private: new FormControl(false, Validators.required)
  });
  poster_url:string = 'https://image.tmdb.org/t/p/w154'
  isViewingTitles:boolean = false;
  isUserLists:boolean = true;
  lists:WatchList[] = [];
  titles:WatchTitle[] = [];
  beforeFilteredTitles:WatchTitle[] = [];
  searchQuery: string = '';

  constructor(private listService:ListService, private titleService:TitleService, private userService:UserService, private http:HttpClient) {}

  ngOnInit(): void {
    this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;
    });

    if (this.currentUser !== null) {
      this.onToggle('user');
    } else {
      this.onToggle('all');
    }
  }

  createNewList() {
    if (this.newListForm.valid) {
      this.http.post<WatchList>(`${environment.apiUrl}/users/${this.currentUser?.username}/lists`, this.newListForm.value).subscribe({
        next: (res:any) => {
          this.onToggle('user');
        },
        error: (res:any) => {
          console.log(res.error);
        }
      });
    }

    console.log(this.newListForm.value);
  }

  onToggle(input:string) {
    if (input === 'user') {
      this.listService.getUserLists(this.currentUser?.username).subscribe({
        next: (lists:WatchList[]) => {
          this.lists = lists;
          this.isViewingTitles = false;
          this.isUserLists = true;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }

    if (input === 'follow') {
      this.listService.getFollowedLists(this.currentUser?.username).subscribe({
        next: (lists:WatchList[]) => {
          this.lists = lists;
          this.beforeFilteredTitles = this.titles;
          this.isViewingTitles = false;
          this.isUserLists = false;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }

    if (input === 'all') {
      this.listService.getAllLists().subscribe({
        next: (lists:WatchList[]) => {
          this.lists = lists;
          this.beforeFilteredTitles = this.titles;
          this.isViewingTitles = false;
          this.isUserLists = false;
        },
        error: (error:any) => {
          console.error('Error fetching lists', error);
        }
      });
    }
  }

  showTitles(id:number, username:string) {
    this.titleService.getTitles(id, username).subscribe({
      next: (titles:WatchTitle[]) => {
        this.titles = titles;
        this.beforeFilteredTitles = this.titles;
        // console.log(this.titles);
      },
      error: (error:any) => {
        console.error('Error fetching titles', error);
      }
    });

    this.isViewingTitles = true;
  }

  closeTitles() {
    this.isViewingTitles = false;
  }

  // Working on filtering titles by search
  searchTitles() {
    this.beforeFilteredTitles = this.titles;

    this.titles.filter(title =>
      title.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      title.release_date.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      title.overview.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      title.runtime.toString().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchInput() {
    if (this.searchQuery === '') {
      this.resetSearch();
    }
  }

  resetSearch() {
    this.titles = this.beforeFilteredTitles;
  }
}
