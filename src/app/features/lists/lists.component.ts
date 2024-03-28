import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ListService } from '../../core/services/list.service';
import { WatchList } from '../../shared/models/watchlist';
import { WatchTitle } from '../../shared/models/watchtitle';
import { TitleService } from '../../core/services/title.service';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
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
  listViewingId:number = 0;
  listViewingUsername:string = '';
  isUserLists:boolean = true;
  displayLists:WatchList[] = [];
  allLists:WatchList[] = [];
  userLists:WatchList[] = [];
  followedLists:WatchList[] = [];
  titles:WatchTitle[] = [];
  beforeFilteredTitles:WatchTitle[] = [];
  filterQuery: string = '';
  listType:string = '';
  isLoading:boolean = false;
  listPageNum:number = 1;
  titlePageNum:number = 1;

  gotAllListsSub = new Subscription;
  gotUserListsSub = new Subscription;
  gotFollowedListsSub = new Subscription;
  gotTitlesSub = new Subscription;

  constructor(private listService:ListService, private titleService:TitleService, private userService:UserService) {}

  @HostListener('window:scroll',['$event'])
  onWindowScroll(){
    if (!this.isViewingTitles) {
      if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading){
        // console.log(event);
        this.loadNextPageLists();
      }
    } else if (this.isViewingTitles) {
      if(window.innerHeight+window.scrollY>=document.body.offsetHeight&&!this.isLoading){
        // console.log(event);
        this.loadNextPageTitles();
      }
    }
  }

  ngOnInit(): void {
    this.listPageNum = 1;
    this.titlePageNum = 1;

    this.currentUserSub = this.userService.currentUserBehaviorSubject.subscribe((user) => {
      this.currentUser = user;

      // if (this.currentUser !== null) {
      //   this.listType = 'all';
      // } else {
      //   this.listType = 'user';
      // }

      // if (this.currentUser !== null) {
      //   this.listService.getUserLists(this.currentUser!.username, this.listPageNum);
      //   this.listService.getFollowedLists(this.currentUser!.username, this.listPageNum);
      // }
      // this.listService.getAllLists(this.listPageNum);
    });

    this.gotAllListsSub = this.listService.gotAllLists.subscribe((gotLists) => {
      if (gotLists.length !== 0) {
        this.allLists = [...this.allLists, ...gotLists];
        this.displayLists = this.allLists;
      }

      if (this.currentUser === null) {
        this.listType = 'all';
        this.displayLists = this.allLists;
      }
    });

    this.gotUserListsSub = this.listService.gotUserLists.subscribe((gotLists) => {
      if (gotLists.length !== 0) {
          this.userLists = [...this.userLists, ...gotLists];
      }

      if (this.currentUser !== null) {
        this.listType = 'user';
        this.displayLists = this.userLists;
      }
    });

    this.gotFollowedListsSub = this.listService.gotFollowedLists.subscribe((gotLists) => {
      if (gotLists.length !== 0) {
        this.followedLists = [...this.followedLists, ...gotLists];
        if (this.listType === 'follow') {
          this.displayLists = this.followedLists;
        }
      }
    });

    this.gotTitlesSub = this.titleService.gotListTitles.subscribe((gotTitles) => {
      if (gotTitles.length !== 0) {
        this.titles = [...this.titles, ...gotTitles];
      }
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
      this.listService.createList(this.currentUser!.username, this.newListForm.value);
      this.onToggle('user');
      this.newListForm.reset({private: false});
    }
  }

  followList(listId:number) {
    this.listService.followList(this.currentUser!.username, listId, this.listPageNum);
  }

  unfollowList(listId:number) {
    this.listService.unfollowList(this.currentUser!.username, listId, this.listPageNum);
  }

  checkIfUserList(listId:number) {
    return this.userLists.some(l => l.id === listId);
  }

  checkIfFollowing(listId:number) {
    return this.followedLists.some(l => l.id === listId);
  }

  onToggle(input:string) {
    if (input === 'all') {
      this.allLists = [];
      this.listType = 'all';
      this.listPageNum = 1;
      this.isLoading = true;
      this.listService.getAllLists(this.listPageNum);
      this.displayLists = this.allLists;
      this.isLoading = false;
    }

    if (input === 'user') {
      this.userLists = [];
      this.listType = 'user';
      this.listPageNum = 1;
      this.isLoading = true;
      this.listService.getUserLists(this.currentUser!.username, this.listPageNum);
      this.displayLists = this.userLists;
      this.isLoading = false;
    }

    if (input === 'follow') {
      this.followedLists = [];
      this.listType = 'follow';
      this.listPageNum = 1;
      this.isLoading = true;
      this.listService.getFollowedLists(this.currentUser!.username, this.listPageNum);
      this.displayLists = this.followedLists;
      this.isLoading = false;
    }
  }

  showTitles(listId:number, username:string) {
    this.titleService.getTitles(listId, username, this.titlePageNum);

    this.isViewingTitles = true;
    this.listViewingId = listId;
    this.listViewingUsername = username;
  }

  closeTitles() {
    this.isViewingTitles = false;
  }

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

  deleteList(listId:number, listIndex:number, username:string) {
    // console.log(this.newListForm.valid);
    // this.newListForm.reset();
    this.listService.setListIdToDelete(listId, listIndex, username);
  }

  deleteTitle(tmdbId:number) {
    this.titleService.deleteTitle(this.currentUser!.username, this.listViewingId, tmdbId);
  }

  loadNextPageLists() {
    this.isLoading = true;

    switch (this.listType) {
      case 'all':
        this.listService.getAllLists(this.listPageNum + 1);
        break;
      case 'user':
        this.listService.getUserLists(this.currentUser!.username, this.listPageNum + 1);
        break;
      case 'follow':
        this.listService.getFollowedLists(this.currentUser!.username, this.listPageNum + 1);
        break;
    }

    this.listPageNum++;
    this.isLoading = false;
  }

  loadNextPageTitles() {
    this.titleService.getTitles(this.listViewingId, this.listViewingUsername, this.titlePageNum + 1);
    this.titlePageNum++;
  }
}
