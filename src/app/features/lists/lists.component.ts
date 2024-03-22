import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { WatchList } from '../../shared/models/watchlist';
import { WatchTitle } from '../../shared/models/watchtitle';
import { TitleService } from '../../core/services/title.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit, OnDestroy {
  currentUser:User | null = null;
  currentUserSub = new Subscription;
  newListForm:FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    private: new FormControl(false, Validators.required)
  });
  poster_url:string = 'https://image.tmdb.org/t/p/w154'
  isViewingTitles:boolean = false;
  isUserLists:boolean = true;
  displayLists:WatchList[] = [];
  allLists:WatchList[] = [];
  userLists:WatchList[] = [];
  followedLists:WatchList[] = [];
  titles:WatchTitle[] = [];
  beforeFilteredTitles:WatchTitle[] = [];
  filterQuery: string = '';

  gotAllListsSub = new Subscription;
  gotUserListsSub = new Subscription;
  gotFollowedListsSub = new Subscription;
  gotTitlesSub = new Subscription;

  constructor(private listService:ListService, private titleService:TitleService, private userService:UserService, private http:HttpClient) {}

  ngOnInit(): void {
    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      this.listService.getUserLists(this.currentUser?.username);
      this.listService.getFollowedLists(this.currentUser?.username);
      this.listService.getAllLists();
    });

    this.gotAllListsSub = this.listService.gotAllLists.subscribe((gotLists) => {
      this.allLists = gotLists;

      if (this.currentUser === null) {
        this.displayLists = this.allLists;
      }
    });

    this.gotUserListsSub = this.listService.gotUserLists.subscribe((gotLists) => {
      this.userLists = gotLists;

      if (this.currentUser !== null) {
        this.displayLists = this.userLists;
      }
    });

    this.gotFollowedListsSub = this.listService.gotFollowedLists.subscribe((gotLists) => {
      this.followedLists = gotLists;
    });

    this.gotTitlesSub = this.titleService.gotListTitles.subscribe((gotTitles) => {
      this.titles = gotTitles;
      this.beforeFilteredTitles = this.titles;
    });
  }

  ngOnDestroy(): void {
    this.currentUserSub.unsubscribe();
    this.gotAllListsSub.unsubscribe();
    this.gotUserListsSub.unsubscribe();
    this.gotFollowedListsSub.unsubscribe();
    this.gotTitlesSub.unsubscribe();
  }

  createNewList() {
    if (this.newListForm.valid) {
      this.http.post<WatchList>(`${environment.apiUrl}/users/${this.currentUser?.username}/lists`, this.newListForm.value).subscribe({
        next: (res:any) => {
          this.onToggle('user');
          console.log(res);
        },
        error: (res:any) => {
          console.log(res.error);
        }
      });
    }

    console.log(this.newListForm.value);
  }

  onToggle(input:string) {
    if (input === 'all') {
      this.listService.getAllLists();
      this.displayLists = this.allLists;
    }

    if (input === 'user') {
      this.listService.getUserLists(this.currentUser?.username);
      this.displayLists = this.userLists;
    }

    if (input === 'follow') {
      this.listService.getFollowedLists(this.currentUser?.username);
      this.displayLists = this.followedLists;
    }
  }

  showTitles(id:number, username:string) {
    this.titleService.getTitles(id, username);

    this.isViewingTitles = true;
  }

  closeTitles() {
    this.isViewingTitles = false;
  }

  // Working on filtering titles by search
  filterTitles() {
    this.resetFilter();

    this.titles = this.titles.filter(title =>
      title.title.toLowerCase().includes(this.filterQuery.toLowerCase()) ||
      title.release_date.toLowerCase().includes(this.filterQuery.toLowerCase()) ||
      title.overview.toLowerCase().includes(this.filterQuery.toLowerCase()) ||
      title.runtime.toString().includes(this.filterQuery.toLowerCase())
    );
  }

  onFilterInput(event:any) {
    if (event.data === null) {
      this.filterQuery = this.filterQuery.substring(0, this.filterQuery.length - 1);
    } else {
      this.filterQuery += event.data;
    }

    console.log(this.filterQuery);

    if (this.filterQuery === '') {
      this.resetFilter();
    } else {
      this.filterTitles();
    }
  }

  resetFilter() {
    this.titles = this.beforeFilteredTitles;
  }

  randomTitle() {
    this.resetFilter();
    this.titles = [this.titles[Math.floor(Math.random()*this.titles.length)]];
  }

  deleteList(listId:number, listIndex:number) {
    this.userService.deleteList(this.currentUser!.username, listId);
    this.userLists.splice(listIndex, 1);
  }
}
